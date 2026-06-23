const DEFAULT_TIMEOUT_MS = 15000

export async function fetchWithTimeout(url, options = {}, ms = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Check your connection and try again.')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
