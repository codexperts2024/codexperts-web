export function formatRequestError(error) {
  const message = error?.message ?? 'Something went wrong. Please try again.'

  if (message.includes('timed out') || message.includes('timeout')) {
    return `${message} If this keeps happening, refresh the page and log in again.`
  }

  if (message.includes('No active session') || message.includes('Unauthorized')) {
    return 'Your session expired. Please refresh the page and log in again.'
  }

  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Network error. Check your internet connection and try again.'
  }

  if (message.includes('row-level security') || message.includes('permission denied') || message.includes('42501')) {
    return 'You do not have permission to do that.'
  }

  if (message.includes('application_status') || message.includes('column')) {
    return 'Database is out of date. Ask a developer to run the latest Supabase migration.'
  }

  if (message.includes('SUPABASE_SERVICE_ROLE_KEY') || message.includes('service role')) {
    return 'Server configuration error. Ask a developer to set SUPABASE_SERVICE_ROLE_KEY in .env.local.'
  }

  return message
}
