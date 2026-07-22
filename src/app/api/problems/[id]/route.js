import { verifyAdminCaller } from '@/lib/adminApi'
import { PROBLEM_BUCKET, CONTENT_TYPE } from '@/services/problemsService'

export const runtime = 'nodejs'

async function removeStorageObject(serviceClient, path) {
  if (!path) return
  const { error } = await serviceClient.storage.from(PROBLEM_BUCKET).remove([path])
  if (error) {
    const message = error.message?.toLowerCase() ?? ''
    if (message.includes('not found') || message.includes('does not exist')) return
    throw error
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyAdminCaller(request)
  if (auth.error) return auth.error

  const { id } = await params
  if (!id) {
    return Response.json({ error: 'Problem id is required.' }, { status: 400 })
  }

  const { serviceClient } = auth

  const { data: problem, error: fetchError } = await serviceClient
    .from('problems')
    .select('file_url, content_type, source_file_url')
    .eq('id', id)
    .single()

  if (fetchError) {
    return Response.json({ error: fetchError.message ?? 'Problem not found.' }, { status: 404 })
  }

  if (problem?.content_type === CONTENT_TYPE.DOCUMENT) {
    try {
      await removeStorageObject(serviceClient, problem.file_url)
      await removeStorageObject(serviceClient, problem.source_file_url)
    } catch (err) {
      return Response.json(
        { error: err?.message ?? 'Failed to remove problem document from storage.' },
        { status: 500 },
      )
    }
  }

  const { error: deleteError } = await serviceClient.from('problems').delete().eq('id', id)
  if (deleteError) {
    return Response.json({ error: deleteError.message ?? 'Failed to delete problem.' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
