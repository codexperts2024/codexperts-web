import { supabase } from '@/lib/supabase'

export const PROBLEM_BUCKET = 'problem-documents'
export const MAX_DOCUMENT_BYTES = 50 * 1024 * 1024

export const CONTENT_TYPE = {
  MARKDOWN: 'markdown',
  DOCUMENT: 'document',
}

export const FILE_FORMAT = {
  DOCX: 'docx',
  PDF: 'pdf',
}

const SELECT_FIELDS = '*'

function mapProblem(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    week: row.week,
    due_date: row.due_date,
    school: row.school,
    content_type: row.content_type ?? CONTENT_TYPE.MARKDOWN,
    file_format: row.file_format,
    file_url: row.file_url,
    source_file_url: row.source_file_url ?? null,
    created_at: row.created_at,
    created_by: row.created_by,
  }
}

export function buildProblemDocumentFilename(problem) {
  const slug = (problem.title || 'problem').trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'problem'
  const ext = problem.file_format === FILE_FORMAT.DOCX ? 'docx' : 'pdf'
  return `${slug}.${ext}`
}

export function getProblemDownloadStoragePath(problem) {
  if (problem.file_format === FILE_FORMAT.DOCX) {
    return problem.source_file_url || problem.file_url
  }
  return problem.file_url
}

export function detectProblemFileType(file) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.md') || name.endsWith('.markdown')) return 'md'
  if (name.endsWith('.docx')) return FILE_FORMAT.DOCX
  if (name.endsWith('.pdf')) return FILE_FORMAT.PDF

  const mime = file.type
  if (mime === 'text/markdown' || mime === 'text/plain' || mime === 'text/x-markdown') return 'md'
  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return FILE_FORMAT.DOCX
  if (mime === 'application/pdf') return FILE_FORMAT.PDF

  return null
}

export async function fetchProblems(schoolFilter) {
  let query = supabase
    .from('problems')
    .select(SELECT_FIELDS)
    .order('created_at', { ascending: false })
    .order('week', { ascending: false, nullsFirst: false })

  if (schoolFilter && schoolFilter !== 'All Schools') {
    query = query.eq('school', schoolFilter)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(mapProblem)
}

export async function fetchProblemById(id) {
  const { data, error } = await supabase
    .from('problems')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()
  if (error) throw error
  return mapProblem(data)
}

export async function createProblem({
  title,
  description = '',
  week,
  dueDate,
  school,
  contentType = CONTENT_TYPE.MARKDOWN,
  fileFormat = null,
  fileUrl = null,
  sourceFileUrl = null,
  createdBy,
}) {
  const { data, error } = await supabase
    .from('problems')
    .insert({
      title,
      description,
      week: week ?? null,
      due_date: dueDate || null,
      school: school || null,
      content_type: contentType,
      file_format: fileFormat,
      file_url: fileUrl,
      source_file_url: sourceFileUrl,
      created_by: createdBy ?? null,
    })
    .select(SELECT_FIELDS)
    .single()

  if (error) throw error
  return mapProblem(data)
}

export async function updateProblem(id, fields) {
  const payload = {}
  if (fields.title !== undefined) payload.title = fields.title
  if (fields.description !== undefined) payload.description = fields.description
  if (fields.week !== undefined) payload.week = fields.week
  if (fields.dueDate !== undefined) payload.due_date = fields.dueDate || null
  if (fields.school !== undefined) payload.school = fields.school || null
  if (fields.contentType !== undefined) payload.content_type = fields.contentType
  if (fields.fileFormat !== undefined) payload.file_format = fields.fileFormat
  if (fields.fileUrl !== undefined) payload.file_url = fields.fileUrl
  if (fields.sourceFileUrl !== undefined) payload.source_file_url = fields.sourceFileUrl

  const { data, error } = await supabase
    .from('problems')
    .update(payload)
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw error
  return mapProblem(data)
}

export async function uploadProblemDocument(file, problemId, accessToken) {
  if (!accessToken) throw new Error('Not authenticated.')

  if (file.size > MAX_DOCUMENT_BYTES) {
    throw new Error('File exceeds the 50 MB limit.')
  }

  const fileType = detectProblemFileType(file)
  if (fileType !== FILE_FORMAT.DOCX && fileType !== FILE_FORMAT.PDF) {
    throw new Error('Only .docx and .pdf files are supported for document upload.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('problemId', String(problemId))

  const res = await fetch('/api/problems/documents', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  })

  const body = await res.json()
  if (!res.ok) throw new Error(body.error ?? 'Upload failed.')
  return {
    path: body.path,
    sourcePath: body.sourcePath ?? null,
    fileFormat: body.fileFormat,
  }
}

export async function previewDocxAsPdf(file, accessToken) {
  if (!accessToken) throw new Error('Not authenticated.')

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/problems/documents/preview', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Failed to preview document.')
  }

  return res.blob()
}

export async function getDocumentSignedUrl(storagePath, accessToken) {
  if (!accessToken) throw new Error('Not authenticated.')

  const res = await fetch(
    `/api/problems/documents?path=${encodeURIComponent(storagePath)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )

  const body = await res.json()
  if (!res.ok) throw new Error(body.error ?? 'Failed to load document.')
  return body.signedUrl
}

export async function downloadProblemDocument(storagePath, accessToken, filename) {
  const params = new URLSearchParams({
    path: storagePath,
    download: '1',
  })
  if (filename) params.set('filename', filename)

  const res = await fetch(`/api/problems/documents?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Failed to download document.')
  }
  return res.blob()
}

export async function removeProblemDocument(storagePath, accessToken) {
  if (!storagePath) return
  if (!accessToken) throw new Error('Not authenticated.')

  const res = await fetch(
    `/api/problems/documents?path=${encodeURIComponent(storagePath)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error ?? 'Failed to remove document.')
}

export async function deleteProblem(id, accessToken) {
  if (!accessToken) throw new Error('Not authenticated.')

  const res = await fetch(`/api/problems/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error ?? 'Failed to delete problem.')
}
