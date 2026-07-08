import { execFile } from 'child_process'
import { access, mkdtemp, readFile, rm, writeFile } from 'fs/promises'
import { constants } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

const MAX_BYTES = 50 * 1024 * 1024

function backendUrl() {
  return process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || ''
}

export function resolveSofficePath() {
  if (process.env.LIBREOFFICE_PATH) return process.env.LIBREOFFICE_PATH
  if (process.platform === 'darwin') {
    return '/Applications/LibreOffice.app/Contents/MacOS/soffice'
  }
  return 'soffice'
}

function assertPdfBuffer(buffer) {
  if (!buffer?.length || buffer.subarray(0, 4).toString() !== '%PDF') {
    throw new Error('Conversion did not produce a valid PDF file.')
  }
}

async function canUseLocalLibreOffice() {
  try {
    await access(resolveSofficePath(), constants.X_OK)
    return true
  } catch {
    return false
  }
}

const PDF_EXPORT_FILTER =
  'pdf:writer_pdf_Export:{"EmbedStandardFonts":{"type":"boolean","value":"true"},"UseTaggedPDF":{"type":"boolean","value":"false"}}'

async function convertWithLocalLibreOffice(buffer) {
  const dir = await mkdtemp(path.join(tmpdir(), 'docx-pdf-'))
  try {
    const input = path.join(dir, 'input.docx')
    const output = path.join(dir, 'input.pdf')
    await writeFile(input, buffer)
    const soffice = resolveSofficePath()
    await execFileAsync(
      soffice,
      [
        '--headless',
        '--nologo',
        '--nofirststartwizard',
        '--convert-to',
        PDF_EXPORT_FILTER,
        '--outdir',
        dir,
        input,
      ],
      { timeout: 120000 },
    )
    const pdf = await readFile(output)
    assertPdfBuffer(pdf)
    return pdf
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function parseBackendError(text) {
  if (!text) return 'DOCX to PDF conversion failed on the server.'
  if (text.includes('Application Error') || text.trimStart().startsWith('<!DOCTYPE')) {
    return 'DOCX conversion server is unavailable. Use local LibreOffice or upload a PDF.'
  }
  try {
    const body = JSON.parse(text)
    return body.detail ?? body.error ?? 'DOCX to PDF conversion failed on the server.'
  } catch {
    return text.replace(/\s+/g, ' ').trim().slice(0, 200)
  }
}

async function convertWithBackend(buffer, filename) {
  const baseUrl = backendUrl().replace(/\/$/, '')
  if (!baseUrl) {
    throw new Error('DOCX conversion backend is not configured. Upload a PDF or install LibreOffice locally.')
  }

  const formData = new FormData()
  formData.append('file', new Blob([buffer]), filename)

  const res = await fetch(`${baseUrl}/documents/convert/docx-to-pdf`, {
    method: 'POST',
    body: formData,
  })

  const bytes = Buffer.from(await res.arrayBuffer())
  if (!res.ok) {
    throw new Error(parseBackendError(bytes.toString('utf-8')))
  }

  assertPdfBuffer(bytes)
  return bytes
}

export async function convertDocxToPdf(buffer, filename = 'document.docx') {
  if (!buffer || buffer.byteLength === 0) {
    throw new Error('Empty DOCX file.')
  }
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error('File exceeds the 50 MB limit.')
  }

  if (await canUseLocalLibreOffice()) {
    let lastError = null
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await convertWithLocalLibreOffice(buffer)
      } catch (err) {
        lastError = err
      }
    }
    throw new Error(
      lastError?.message
        ? `Local DOCX conversion failed: ${lastError.message}`
        : 'Local DOCX conversion failed.',
    )
  }

  return convertWithBackend(buffer, filename)
}
