const DEFAULT_LOAD_TIMEOUT_MS = 15000

/**
 * Standard guard for client-side data loads (Supabase queries, parallel fetches).
 * Use in useEffect: call cleanup() on unmount.
 *
 * @example
 * useEffect(() => {
 *   const guard = createLoadGuard()
 *   async function load() {
 *     try {
 *       setLoading(true)
 *       const data = await fetchThings({ signal: guard.signal })
 *       if (!guard.isCancelled()) setThings(data)
 *     } catch (err) {
 *       if (!guard.isCancelled()) setError(guard.loadError(err))
 *     } finally {
 *       if (!guard.isCancelled()) setLoading(false)
 *     }
 *   }
 *   load()
 *   return () => guard.cleanup()
 * }, [])
 */
export function createLoadGuard(ms = DEFAULT_LOAD_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  let cancelled = false

  return {
    signal: controller.signal,
    isCancelled: () => cancelled,
    cleanup() {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    },
    loadError(err, fallback = 'Failed to load. Please try again.') {
      if (err?.name === 'AbortError') {
        return 'Request timed out. Refresh the page and try again.'
      }
      return err?.message || fallback
    },
  }
}

export { DEFAULT_LOAD_TIMEOUT_MS }
