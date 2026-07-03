import { verifyAdminCaller } from '@/lib/adminApi'
import { convertDocxToPdf } from '@/lib/docxToPdfServer'

export const runtime = 'nodejs'

export async function POST(request) {
  const auth = await verifyAdminCaller(request)
  if (auth.error) return auth.error

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file.name !== 'string' || !file.name.toLowerCase().endsWith('.docx')) {
    return Response.json({ error: 'A .docx file is required.' }, { status: 400 })
  }

  try {
    const pdfBuffer = await convertDocxToPdf(Buffer.from(await file.arrayBuffer()), file.name)
    const pdfName = file.name.replace(/\.docx$/i, '.pdf')

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${pdfName}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return Response.json(
      {
        error: err?.message
          ?? 'Could not convert DOCX to PDF. Install LibreOffice locally, configure BACKEND_API_URL, or upload a PDF instead.',
      },
      { status: 422 },
    )
  }
}
