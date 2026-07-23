const DEFAULT_API_URL = ''

export function getBackendApiUrl() {
  const url = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '')
  return url
}

export async function backendFetch(path, { accessToken, method = 'GET', body } = {}) {
  const base = getBackendApiUrl()
  if (!base) {
    throw new Error('Backend API URL is not configured (NEXT_PUBLIC_API_URL)')
  }
  if (!accessToken) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body != null ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const detail = data?.detail
    const message = typeof detail === 'string'
      ? detail
      : Array.isArray(detail)
        ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
        : data?.error || `Request failed (${response.status})`
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}
