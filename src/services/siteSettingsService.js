import { supabase } from '@/lib/supabase'

export async function getSiteSetting(key, { signal } = {}) {
  let query = supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle()
  if (signal) query = query.abortSignal(signal)
  const { data, error } = await query
  if (error) throw error
  return data?.value ?? null
}

export async function updateSiteSetting(key, value) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select('value')
    .single()
  if (error) throw error
  return data.value
}
