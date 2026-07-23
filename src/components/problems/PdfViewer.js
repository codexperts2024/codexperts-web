'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const MIN_SCALE = 0.5
const MAX_SCALE = 2.5
const SCALE_STEP = 0.1

function ThumbnailPanelIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  )
}
async function renderPageToCanvas(page, canvas, scale) {
  const viewport = page.getViewport({ scale })
  const context = canvas.getContext('2d')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: context, viewport }).promise
}

export default function PdfViewer({ url, title = 'Problem document', className = '', fill = false }) {
  const mainCanvasRef = useRef(null)
  const thumbCanvasRefs = useRef([])
  const [pdf, setPdf] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let loadingTask

    async function load() {
      setLoading(true)
      setError('')
      setPdf(null)
      setPageCount(0)
      setPageNumber(1)
      try {
        loadingTask = getDocument(url)
        const doc = await loadingTask.promise
        if (cancelled) {
          doc.destroy()
          return
        }
        setPdf(doc)
        setPageCount(doc.numPages)
      } catch {
        if (!cancelled) setError('Failed to load PDF.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      loadingTask?.destroy?.()
    }
  }, [url])

  useEffect(() => {
    if (!pdf || !mainCanvasRef.current) return
    let cancelled = false

    async function draw() {
      const page = await pdf.getPage(pageNumber)
      if (cancelled || !mainCanvasRef.current) return
      await renderPageToCanvas(page, mainCanvasRef.current, scale)
    }

    draw().catch(() => {
      if (!cancelled) setError('Failed to render page.')
    })

    return () => { cancelled = true }
  }, [pdf, pageNumber, scale])

  useEffect(() => {
    if (!pdf || !sidebarOpen) return
    let cancelled = false

    async function drawThumbs() {
      for (let i = 1; i <= pdf.numPages; i += 1) {
        const canvas = thumbCanvasRefs.current[i - 1]
        if (!canvas) continue
        const page = await pdf.getPage(i)
        if (cancelled) return
        await renderPageToCanvas(page, canvas, 0.2)
      }
    }

    drawThumbs().catch(() => {})
    return () => { cancelled = true }
  }, [pdf, sidebarOpen])

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN_SCALE, Math.round((s - SCALE_STEP) * 10) / 10))
  }, [])

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, Math.round((s + SCALE_STEP) * 10) / 10))
  }, [])

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

  return (
    <div
      className={`flex flex-col border border-border rounded-md overflow-hidden bg-bg-elevated ${
        fill ? 'h-full min-h-0' : 'min-h-[70vh]'
      } ${className}`}
    >
      <div className="flex items-center gap-2 px-2 py-1.5 bg-bg-elevated text-bg-base shrink-0 border-b border-border-strong">
        <button
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          title={sidebarOpen ? 'Hide thumbnails' : 'Show thumbnails'}
          aria-label={sidebarOpen ? 'Hide thumbnails' : 'Show thumbnails'}
          aria-pressed={sidebarOpen}
          className={`p-1.5 rounded hover:bg-white/10 ${sidebarOpen ? 'bg-white/10' : ''}`}
        >
          <ThumbnailPanelIcon size={18} />
        </button>
        <p className="font-inter text-xs truncate flex-1 min-w-0 opacity-90">{title}</p>
        <div className="flex items-center gap-1 font-inter text-xs shrink-0">
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((n) => Math.max(1, n - 1))}
            className="px-1.5 py-0.5 rounded hover:bg-white/10 disabled:opacity-40"
          >
            ‹
          </button>
          <span>
            {pageNumber}
            {' / '}
            {pageCount}
          </span>
          <button
            type="button"
            disabled={pageNumber >= pageCount}
            onClick={() => setPageNumber((n) => Math.min(pageCount, n + 1))}
            className="px-1.5 py-0.5 rounded hover:bg-white/10 disabled:opacity-40"
          >
            ›
          </button>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-40"
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>
          <span className="font-inter text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-40"
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 bg-bg-layer1">
        {sidebarOpen && (
          <aside className="w-28 shrink-0 overflow-y-auto border-r border-border-strong bg-bg-elevated p-2 space-y-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setPageNumber(i + 1)}
                className={`block w-full rounded border p-1 ${
                  pageNumber === i + 1
                    ? 'border-accent'
                    : 'border-transparent hover:border-border'
                }`}
              >
                <canvas
                  ref={(el) => { thumbCanvasRefs.current[i] = el }}
                  className="w-full h-auto bg-white rounded-sm"
                />
                <span className="block text-center font-inter text-[10px] text-bg-base mt-1 opacity-80">
                  {i + 1}
                </span>
              </button>
            ))}
          </aside>
        )}
        <div className="flex-1 overflow-auto p-3 flex justify-center items-start">
          <canvas ref={mainCanvasRef} className="bg-white shadow-sm max-w-full h-auto" />
        </div>
      </div>
    </div>
  )
}
