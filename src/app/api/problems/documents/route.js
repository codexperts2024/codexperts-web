import { randomUUID } from 'crypto'
import { verifyAdminCaller, verifyMemberPlusCaller } from '@/lib/adminApi'
import { convertDocxToPdf } from '@/lib/docxToPdfServer'
import {
  PROBLEM_BUCKET,
  MAX_DOCUMENT_BYTES,
  detectProblemFileType,
  FILE_FORMAT,
} from '@/services/problemsService'

export const runtime = 'nodejs'

async function uploadBytes(serviceClient, path, bytes, contentType) {
  const { error } = await serviceClient.storage
    .from(PROBLEM_BUCKET)
    .upload(path, bytes, { contentType, upsert: false })

  if (error) throw error
}

export async function POST(request) {
  const auth = await verifyAdminCaller(request)
  if (auth.error) return auth.error

  const formData = await request.formData()
  const file = formData.get('file')
  const problemId = formData.get('problemId')

  if (!file || typeof problemId !== 'string' || !problemId.trim()) {
    return Response.json({ error: 'File and problemId are required.' }, { status: 400 })
  }

  if (file.size > MAX_DOCUMENT_BYTES) {
    return Response.json({ error: 'File exceeds the 50 MB limit.' }, { status: 400 })
  }

  const sourceType = detectProblemFileType(file)
  if (sourceType !== FILE_FORMAT.DOCX && sourceType !== FILE_FORMAT.PDF) {
    return Response.json({ error: 'Only .docx and .pdf files are supported.' }, { status: 400 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())

  try {
    if (sourceType === FILE_FORMAT.DOCX) {
      const sourcePath = `${problemId}/${randomUUID()}.docx`
      const pdfPath = `${problemId}/${randomUUID()}.pdf`
      const pdfBytes = await convertDocxToPdf(bytes, file.name)

      await uploadBytes(
        auth.serviceClient,
        sourcePath,
        bytes,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      )
      await uploadBytes(auth.serviceClient, pdfPath, pdfBytes, 'application/pdf')

      return Response.json({
        path: pdfPath,
        sourcePath,
        fileFormat: FILE_FORMAT.DOCX,
      })
    }

    const pdfPath = `${problemId}/${randomUUID()}.pdf`
    await uploadBytes(auth.serviceClient, pdfPath, bytes, 'application/pdf')

    return Response.json({
      path: pdfPath,
      sourcePath: null,
      fileFormat: FILE_FORMAT.PDF,
    })
  } catch (err) {
    if (sourceType === FILE_FORMAT.DOCX) {
      return Response.json(
        {
          error: err?.message
            ?? 'Could not convert DOCX to PDF. Upload a PDF instead, or configure document conversion.',
        },
        { status: 422 },
      )
    }
    return Response.json({ error: err?.message ?? 'Upload failed.' }, { status: 500 })
  }
}

export async function GET(request) {
  const auth = await verifyMemberPlusCaller(request)
  if (auth.error) return auth.error

  const path = request.nextUrl.searchParams.get('path')
  if (!path) {
    return Response.json({ error: 'path is required.' }, { status: 400 })
  }

  if (request.nextUrl.searchParams.get('download') === '1') {
    const { data, error } = await auth.serviceClient.storage
      .from(PROBLEM_BUCKET)
      .download(path)

    if (error) {
      return Response.json({ error: error.message ?? 'Failed to download file.' }, { status: 500 })
    }

    const ext = path.split('.').pop()?.toLowerCase()
    const contentType = ext === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    const filename = request.nextUrl.searchParams.get('filename')
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    }
    if (filename) {
      headers['Content-Disposition'] = `attachment; filename="${filename.replace(/"/g, '')}"`
    }

    return new Response(data, { headers })
  }

  const { data, error } = await auth.serviceClient.storage
    .from(PROBLEM_BUCKET)
    .createSignedUrl(path, 3600)

  if (error) {
    return Response.json({ error: error.message ?? 'Failed to create signed URL.' }, { status: 500 })
  }

  return Response.json({ signedUrl: data.signedUrl })
}

export async function DELETE(request) {
  const auth = await verifyAdminCaller(request)
  if (auth.error) return auth.error

  const path = request.nextUrl.searchParams.get('path')
  if (!path) {
    return Response.json({ error: 'path is required.' }, { status: 400 })
  }

  const { error } = await auth.serviceClient.storage.from(PROBLEM_BUCKET).remove([path])
  if (error) {
    return Response.json({ error: error.message ?? 'Failed to delete file.' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
