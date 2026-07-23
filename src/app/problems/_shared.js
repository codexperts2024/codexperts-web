'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Plus, Upload, X } from 'lucide-react'

const PdfViewer = dynamic(() => import('@/components/problems/PdfViewer'), { ssr: false })
import { uploadImage } from '@/services/cloudinaryService'
import { resolveMarkdownWithAssets, pickMarkdownFile, countUnresolvedImageRefs, prepareMarkdownForDisplay, buildPendingImageMap, guessTitleFromImport, guessTitleFromFilename, applyLocalImagesForPreview } from '@/utils/markdownImport'
import { extractFilesFromZip, isZipFile } from '@/utils/zipImport'
import {
  CONTENT_TYPE,
  FILE_FORMAT,
  MAX_SAMPLE_TESTS,
  detectProblemFileType,
  downloadProblemDocument,
  emptySamplePair,
  normalizeSampleTests,
  previewDocxAsPdf,
} from '@/services/problemsService'

const MarkdownCodeEditor = dynamic(() => import('../announcements/_editor'), { ssr: false })

export const SCHOOL_OPTIONS = ['Seneca College', 'York University']

export const mdComponents = {
  h1: ({ children }) => <h1 className="font-montserrat font-bold text-2xl text-text-primary mt-6 mb-3">{children}</h1>,
  h2: ({ children }) => <h2 className="font-montserrat font-semibold text-xl text-text-primary mt-5 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="font-montserrat font-medium text-lg text-text-primary mt-4 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-text-primary font-inter text-base leading-[1.7] mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-text-primary font-inter">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-text-primary font-inter">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => <a href={href} className="text-link hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
  img: ({ src, alt }) => {
    if (!src || (!/^https?:/i.test(src) && !src.startsWith('data:') && !src.startsWith('blob:'))) return null
    return <img src={src} alt={alt ?? ''} className="max-w-full rounded-md my-4" />
  },
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="border-collapse border border-border w-full text-sm font-inter">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-bg-surface">{children}</thead>,
  th: ({ children }) => (
    <th className="border border-border px-3 py-2 text-left font-medium text-text-primary">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2 align-top text-text-primary">{children}</td>
  ),
  blockquote: ({ children }) => <blockquote className="border-l-4 border-border pl-4 italic text-text-secondary my-4">{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = Boolean(className?.includes('language-'))
    return isBlock
      ? <code className="block bg-bg-elevated rounded p-4 font-mono text-sm overflow-x-auto my-4">{children}</code>
      : <code className="bg-bg-elevated rounded px-1 py-0.5 font-mono text-sm">{children}</code>
  },
  hr: () => <hr className="border-border my-6" />,
}

export function emptyProblemForm() {
  return {
    title: '',
    week: '',
    dueDate: '',
    school: SCHOOL_OPTIONS[0],
    contentType: CONTENT_TYPE.MARKDOWN,
    fileFormat: null,
    description: '',
    pendingFile: null,
    fileUrl: null,
    sourceFileUrl: null,
    documentName: null,
    pendingImageFiles: [],
    sampleTests: [emptySamplePair()],
  }
}

export function problemToForm(problem) {
  const samples = normalizeSampleTests(problem.sample_tests)
  return {
    title: problem.title ?? '',
    week: problem.week != null ? String(problem.week) : '',
    dueDate: problem.due_date ? String(problem.due_date).slice(0, 10) : '',
    school: problem.school ?? SCHOOL_OPTIONS[0],
    contentType: problem.content_type ?? CONTENT_TYPE.MARKDOWN,
    fileFormat: problem.file_format,
    description: problem.description ?? '',
    pendingFile: null,
    fileUrl: problem.file_url,
    sourceFileUrl: problem.source_file_url ?? null,
    documentName: problem.file_url ? problem.file_url.split('/').pop() : null,
    pendingImageFiles: [],
    sampleTests: samples.length > 0 ? samples : [emptySamplePair()],
  }
}

function EditorTabs({ activeTab, onTabChange, disabled }) {
  return (
    <div className="flex border-b border-border bg-bg-surface px-3 pt-2 rounded-t-md gap-1">
      {['Write', 'Preview'].map(tab => (
        <button
          key={tab}
          type="button"
          disabled={disabled}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-1.5 text-sm font-inter rounded-t-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            activeTab === tab
              ? 'bg-bg-base border border-b-0 border-border text-text-primary font-medium -mb-px pb-2'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}

async function renderDocxToElement(buffer, container) {
  container.innerHTML = ''
  const { renderAsync } = await import('docx-preview')
  await renderAsync(buffer, container, container, {
    className: 'docx-preview-problem',
    inWrapper: true,
    ignoreWidth: false,
    ignoreHeight: false,
    ignoreFonts: false,
    useBase64URL: true,
    breakPages: false,
    experimental: true,
  })
}

function MarkdownBody({ children, pendingImageMap }) {
  const prepared = prepareMarkdownForDisplay(children)
  const preview = applyLocalImagesForPreview(prepared, pendingImageMap)
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {preview}
    </Markdown>
  )
}

export function DocumentViewer({
  storagePath,
  fileFormat,
  accessToken,
  className = '',
  fill = false,
  title = 'Problem document',
}) {
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [docxBuffer, setDocxBuffer] = useState(null)
  const isPdfStorage = storagePath?.toLowerCase().endsWith('.pdf')

  useEffect(() => {
    if (!storagePath || !fileFormat || !accessToken) {
      setLoading(false)
      return
    }

    let cancelled = false
    let objectUrl = ''

    async function load() {
      setLoading(true)
      setError('')
      setPdfUrl('')
      setDocxBuffer(null)
      try {
        if (isPdfStorage) {
          const blob = await downloadProblemDocument(storagePath, accessToken)
          objectUrl = URL.createObjectURL(blob)
          if (!cancelled) setPdfUrl(objectUrl)
        } else if (fileFormat === FILE_FORMAT.DOCX) {
          const blob = await downloadProblemDocument(storagePath, accessToken)
          if (!cancelled) setDocxBuffer(await blob.arrayBuffer())
        }
      } catch {
        if (!cancelled) setError('Failed to load document.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [storagePath, fileFormat, accessToken, isPdfStorage])

  useEffect(() => {
    if (!docxBuffer || !containerRef.current) return

    let cancelled = false
    renderDocxToElement(docxBuffer, containerRef.current).catch(() => {
      if (!cancelled) setError('Failed to render document.')
    })

    return () => { cancelled = true }
  }, [docxBuffer])

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  if (error) {
    return <p className={`text-text-secondary font-inter text-sm ${className}`}>{error}</p>
  }

  if (isPdfStorage && pdfUrl) {
    return (
      <PdfViewer
        url={pdfUrl}
        title={title}
        fill={fill}
        className={className}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto border border-border rounded-md bg-bg-base p-2 sm:p-4 ${
        fill ? 'h-full min-h-0' : 'min-h-[50vh]'
      } ${className}`}
    />
  )
}

function PendingDocumentPreview({ file, fileFormat, accessToken }) {
  const [pdfUrl, setPdfUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let objectUrl = ''

    async function load() {
      setLoading(true)
      setError('')
      setPdfUrl('')
      try {
        if (fileFormat === FILE_FORMAT.PDF) {
          objectUrl = URL.createObjectURL(file)
          if (!cancelled) setPdfUrl(objectUrl)
        } else if (fileFormat === FILE_FORMAT.DOCX) {
          const pdfBlob = await previewDocxAsPdf(file, accessToken)
          objectUrl = URL.createObjectURL(pdfBlob)
          if (!cancelled) setPdfUrl(objectUrl)
        }
      } catch (err) {
        if (!cancelled) setError(err?.message ?? 'Failed to preview document.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file, fileFormat, accessToken])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        {fileFormat === FILE_FORMAT.DOCX && (
          <p className="text-sm font-inter text-text-secondary">Converting Word to PDF for preview…</p>
        )}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm font-inter text-accent">{error}</p>
  }

  if (pdfUrl) {
    return (
      <PdfViewer
        url={pdfUrl}
        title="Document preview"
        className="w-full"
      />
    )
  }

  return null
}

export function ProblemForm({ form, onChange, onSubmit, onCancel, submitting, editMode = false, accessToken }) {
  const [tab, setTab] = useState('Write')
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState('')
  const [editorKey, setEditorKey] = useState(0)
  const fileInputRef = useRef(null)

  const isDocument = form.contentType === CONTENT_TYPE.DOCUMENT

  const applyMdBundle = useCallback(async (files, titleSourceFile) => {
    const mdFile = pickMarkdownFile(files)
    if (!mdFile) return
    setFileError('')
    try {
      let text = await readFileAsText(mdFile)
      const pendingImageMap = buildPendingImageMap(files)
      const hasImages = pendingImageMap.size > 0
      const uploader = accessToken
        ? async (img) => {
            const { url } = await uploadImage(img, 'problems')
            return url
          }
        : null

      if (hasImages && !accessToken) {
        setFileError('Sign in again to upload images with this markdown file.')
        return
      }

      text = await resolveMarkdownWithAssets(text, files, uploader)

      const missingImages = countUnresolvedImageRefs(text)
      if (missingImages > 0 && !hasImages) {
        setFileError(
          `${missingImages} image(s) missing. Import or drop image files separately (filenames must match the markdown).`,
        )
      } else if (missingImages > 0) {
        setFileError(
          `Imported with ${missingImages} unresolved image(s). Check filenames match paths in the markdown.`,
        )
      }

      const titleFile = titleSourceFile ?? mdFile
      onChange(prev => ({
        ...prev,
        contentType: CONTENT_TYPE.MARKDOWN,
        fileFormat: null,
        description: text,
        pendingFile: null,
        fileUrl: null,
        documentName: null,
        pendingImageFiles: [...pendingImageMap.values()],
        title: prev.title.trim() || guessTitleFromImport(mdFile, text) || guessTitleFromFilename(titleFile.name),
      }))
      setEditorKey(k => k + 1)
      setTab('Write')
    } catch {
      setFileError('Failed to read the markdown file.')
    }
  }, [onChange, accessToken])

  const attachMarkdownImages = useCallback(async (imageFiles) => {
    if (!imageFiles.length) return
    if (!accessToken) {
      setFileError('Sign in again to upload images.')
      return
    }

    setFileError('')
    try {
      const existing = form.pendingImageFiles ?? []
      const merged = [...existing]
      for (const file of imageFiles) {
        const name = file.name.toLowerCase()
        const idx = merged.findIndex(f => f.name.toLowerCase() === name)
        if (idx >= 0) merged[idx] = file
        else merged.push(file)
      }

      const uploader = async (img) => {
        const { url } = await uploadImage(img, 'problems')
        return url
      }
      const text = await resolveMarkdownWithAssets(form.description, merged, uploader)
      const missingImages = countUnresolvedImageRefs(text)
      if (missingImages > 0) {
        setFileError(
          `${missingImages} image(s) still missing. Filenames must match paths in the markdown.`,
        )
      }

      onChange(prev => ({
        ...prev,
        contentType: CONTENT_TYPE.MARKDOWN,
        description: text,
        pendingImageFiles: merged,
      }))
    } catch {
      setFileError('Failed to attach images.')
    }
  }, [accessToken, form.description, form.pendingImageFiles, onChange])

  const applyFile = useCallback(async (file) => {
    if (!file) return
    setFileError('')

    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(file.name)) {
      await attachMarkdownImages([file])
      return
    }

    if (isZipFile(file)) {
      try {
        const extracted = await extractFilesFromZip(file)
        if (pickMarkdownFile(extracted)) {
          await applyMdBundle(extracted, file)
          return
        }
        setFileError('Zip file must include a .md file.')
      } catch (err) {
        setFileError(err?.message || 'Failed to read the zip file.')
      }
      return
    }

    const type = detectProblemFileType(file)
    if (!type) {
      setFileError('Unsupported file type. Use .md, .docx, .pdf, or an image file.')
      return
    }

    if (type === 'md') {
      await applyMdBundle([file])
      return
    }

    onChange(prev => ({
      ...prev,
      contentType: CONTENT_TYPE.DOCUMENT,
      fileFormat: type,
      description: '',
      pendingFile: file,
      documentName: file.name,
      pendingImageFiles: [],
      title: prev.title.trim() || guessTitleFromFilename(file.name),
    }))
  }, [onChange, applyMdBundle, attachMarkdownImages])

  const applyDroppedFiles = useCallback(async (files) => {
    if (files.length === 0) return

    const images = files.filter(f => /\.(png|jpe?g|gif|webp|svg)$/i.test(f.name))
    const nonImages = files.filter(f => !/\.(png|jpe?g|gif|webp|svg)$/i.test(f.name))

    if (pickMarkdownFile(nonImages)) {
      await applyMdBundle(files)
      return
    }

    const zipFile = nonImages.find(isZipFile)
    if (zipFile) {
      await applyFile(zipFile)
      return
    }

    if (images.length > 0 && nonImages.length === 0) {
      await attachMarkdownImages(images)
      return
    }

    if (nonImages[0]) await applyFile(nonImages[0])
  }, [applyFile, applyMdBundle, attachMarkdownImages])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const files = Array.from(e.dataTransfer?.files ?? [])
    if (files.length === 0) return
    await applyDroppedFiles(files)
  }, [applyDroppedFiles])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    setDragOver(true)
  }, [])

  const onFilePick = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (file) await applyFile(file)
    e.target.value = ''
  }, [applyFile])

  const canPublish = form.title.trim() && (
    isDocument
      ? (form.pendingFile || (editMode && form.fileUrl))
      : true
  )
  const pendingImageMap = new Map(
    (form.pendingImageFiles ?? []).map((file) => [file.name.toLowerCase(), file]),
  )

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title (required)"
        value={form.title}
        onChange={e => onChange(prev => ({ ...prev, title: e.target.value }))}
        className={`w-full border rounded-md px-3 py-2 text-sm font-inter text-text-primary bg-bg-base focus:outline-none focus:border-border-strong ${
          form.title.trim() ? 'border-border' : 'border-accent'
        }`}
      />
      {!form.title.trim() && (
        <p className="text-sm font-inter text-accent -mt-2">Add a title to enable Publish.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="number"
          min="1"
          placeholder="Week #"
          value={form.week}
          onChange={e => onChange(prev => ({ ...prev, week: e.target.value }))}
          className="border border-border rounded-md px-3 py-2 text-sm font-inter text-text-primary bg-bg-base focus:outline-none focus:border-border-strong"
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={e => onChange(prev => ({ ...prev, dueDate: e.target.value }))}
          className="border border-border rounded-md px-3 py-2 text-sm font-inter text-text-primary bg-bg-base focus:outline-none focus:border-border-strong"
        />
        <select
          value={form.school}
          onChange={e => onChange(prev => ({ ...prev, school: e.target.value }))}
          className="border border-border rounded-md px-3 py-2 text-sm font-inter text-text-primary bg-bg-base focus:outline-none focus:border-border-strong"
        >
          {SCHOOL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onDragEnter={handleDragOver}
        className={`border rounded-md overflow-hidden transition-colors ${
          dragOver ? 'border-accent bg-accent-bg' : 'border-border'
        }`}
      >
        {isDocument ? (
          <div
            className="bg-bg-base p-6 min-h-[360px] flex flex-col gap-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex items-start gap-3 text-text-secondary font-inter text-sm">
              <Upload size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">Document mode</p>
                <p>Word / Google Docs export (.docx) converts to PDF automatically. PDF uploads as-is. View-only after publish.</p>
                <p className="text-text-hint text-xs mt-1">For pixel-perfect layout, export PDF from Word and upload the PDF. Server conversion may differ slightly from Word.</p>
              </div>
            </div>
            {form.documentName && (
              <p className="text-sm font-inter text-text-primary">
                File: <span className="font-medium">{form.documentName}</span>
                {form.fileFormat === FILE_FORMAT.DOCX && (
                  <span className="text-text-hint ml-2">→ saved as PDF</span>
                )}
                {form.fileFormat === FILE_FORMAT.PDF && (
                  <span className="text-text-hint ml-2 uppercase">pdf</span>
                )}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-surface transition-colors"
              >
                {form.pendingFile || form.fileUrl ? 'Replace file' : 'Choose file'}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-inter text-text-hint hover:text-text-secondary"
              >
                or drop a file here
              </button>
            </div>
            {form.pendingFile ? (
              <PendingDocumentPreview
                file={form.pendingFile}
                fileFormat={form.fileFormat}
                accessToken={accessToken}
              />
            ) : editMode && form.fileUrl && (
              <DocumentViewer
                storagePath={form.fileUrl}
                fileFormat={form.fileFormat}
                accessToken={accessToken}
              />
            )}
          </div>
        ) : (
          <>
            <EditorTabs activeTab={tab} onTabChange={setTab} disabled={false} />
            {tab === 'Write' ? (
              <div className="bg-bg-base relative">
                <MarkdownCodeEditor
                  key={editorKey}
                  value={form.description}
                  onChange={val => onChange(prev => ({ ...prev, description: val ?? '' }))}
                  onFilesDrop={applyDroppedFiles}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 z-10 text-xs font-inter text-text-hint hover:text-text-secondary border border-border rounded px-2 py-1 bg-bg-base"
                >
                  Import file
                </button>
              </div>
            ) : (
              <div className="min-h-[360px] bg-bg-base px-6 py-4">
                {form.description.trim() ? (
                  <MarkdownBody pendingImageMap={pendingImageMap}>{form.description}</MarkdownBody>
                ) : (
                  <p className="text-text-hint font-inter text-sm italic">Nothing to preview.</p>
                )}
              </div>
            )}
            <p className="text-xs text-text-hint font-inter px-4 py-2 border-t border-border bg-bg-surface">
              Type, paste, or import one file (.md / .docx / .pdf / image). Word becomes PDF. For markdown photos, import images separately.
            </p>
          </>
        )}
      </div>

      {fileError && (
        <p className="text-sm font-inter text-accent">{fileError}</p>
      )}

      <div className="border border-border rounded-md bg-bg-base p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-inter text-sm font-medium text-text-primary">Sample tests</p>
            <p className="font-inter text-xs text-text-secondary mt-1">
              Used when members click Run on Solutions. Start with one pair; add up to {MAX_SAMPLE_TESTS}.
            </p>
          </div>
          <button
            type="button"
            disabled={(form.sampleTests?.length ?? 0) >= MAX_SAMPLE_TESTS}
            onClick={() => onChange((prev) => ({
              ...prev,
              sampleTests: [...(prev.sampleTests ?? [emptySamplePair()]), emptySamplePair()]
                .slice(0, MAX_SAMPLE_TESTS),
            }))}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-inter text-sm text-text-primary hover:bg-bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {(form.sampleTests?.length ? form.sampleTests : [emptySamplePair()]).map((sample, index) => (
          <div key={index} className="space-y-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-inter text-sm font-medium text-text-primary">
                Sample
                {' '}
                {index + 1}
              </p>
              {(form.sampleTests?.length ?? 0) > 1 && (
                <button
                  type="button"
                  onClick={() => onChange((prev) => {
                    const next = [...(prev.sampleTests ?? [])]
                    next.splice(index, 1)
                    return {
                      ...prev,
                      sampleTests: next.length > 0 ? next : [emptySamplePair()],
                    }
                  })}
                  className="inline-flex items-center gap-1 font-inter text-xs text-text-secondary hover:text-accent"
                  aria-label={`Remove sample ${index + 1}`}
                >
                  <X size={14} />
                  Remove
                </button>
              )}
            </div>
            <label className="block space-y-1">
              <span className="font-inter text-xs text-text-secondary">
                Sample Input
                {' '}
                {index + 1}
              </span>
              <textarea
                value={sample.stdin}
                onChange={(e) => onChange((prev) => {
                  const next = [...(prev.sampleTests?.length ? prev.sampleTests : [emptySamplePair()])]
                  next[index] = { ...next[index], stdin: e.target.value }
                  return { ...prev, sampleTests: next }
                })}
                rows={3}
                spellCheck={false}
                className="w-full border border-border rounded-md px-3 py-2 font-mono text-sm text-text-primary bg-bg-base focus:outline-none focus:border-border-strong"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-inter text-xs text-text-secondary">
                Sample Output
                {' '}
                {index + 1}
              </span>
              <textarea
                value={sample.expected_stdout}
                onChange={(e) => onChange((prev) => {
                  const next = [...(prev.sampleTests?.length ? prev.sampleTests : [emptySamplePair()])]
                  next[index] = { ...next[index], expected_stdout: e.target.value }
                  return { ...prev, sampleTests: next }
                })}
                rows={3}
                spellCheck={false}
                className="w-full border border-border rounded-md px-3 py-2 font-mono text-sm text-text-primary bg-bg-base focus:outline-none focus:border-border-strong"
              />
            </label>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.docx,.pdf,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,text/markdown,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,application/zip"
        className="hidden"
        onChange={onFilePick}
      />

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-surface transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canPublish || submitting}
          className="px-5 py-2 bg-accent text-white rounded-md text-sm font-medium font-inter hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (editMode ? 'Saving...' : 'Publishing...') : (editMode ? 'Save' : 'Publish')}
        </button>
      </div>
    </div>
  )
}

export function ProblemBody({ problem, accessToken, fill = false }) {
  if (problem.content_type === CONTENT_TYPE.DOCUMENT && problem.file_url) {
    return (
      <DocumentViewer
        storagePath={problem.file_url}
        fileFormat={problem.file_format}
        accessToken={accessToken}
        fill={fill}
        title={problem.title || 'Problem document'}
        className={fill ? 'h-full min-h-0' : 'mb-8'}
      />
    )
  }

  return (
    <div className={`font-inter text-base text-text-primary leading-[1.7] prose max-w-none
      prose-headings:font-montserrat prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
      prose-code:font-mono prose-code:text-sm prose-code:bg-bg-elevated prose-code:px-1 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-bg-elevated prose-pre:p-4 prose-pre:rounded-lg prose-pre:font-mono prose-pre:text-sm ${
        fill ? 'h-full min-h-0' : 'mb-8'
      }`}>
      <MarkdownBody>{problem.description || '_No content._'}</MarkdownBody>
    </div>
  )
}
