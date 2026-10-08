// Read public settings without a browser session or service-role credentials.
export async function getHeroImageUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!baseUrl || !anonKey) return null

  try {
    const url = new URL('/rest/v1/site_settings', baseUrl)
    url.searchParams.set('select', 'value')
    url.searchParams.set('key', 'eq.hero_image_url')
    const response = await fetch(url, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return null
    const rows = await response.json()
    return rows[0]?.value || null
  } catch {
    // A settings outage must not prevent the homepage from rendering.
    return null
  }
}
