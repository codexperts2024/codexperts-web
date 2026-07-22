const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

/**
 * Allow only safe markdown link/image URLs.
 * Returns null when the URL must not be rendered as href/src.
 */
export function sanitizeMarkdownUrl(url) {
  if (!url || typeof url !== 'string') return null

  const value = url.trim()
  if (!value) return null

  // Same-site relative paths (not protocol-relative //evil.com)
  if (value.startsWith('/') && !value.startsWith('//')) return value

  let parsed
  try {
    parsed = new URL(value)
  } catch {
    return null
  }

  if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null
  return value
}
