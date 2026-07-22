import { supabase } from '@/lib/supabase'

const SELECT_FIELDS = [
  'id',
  'title',
  'category',
  'description',
  'body',
  'event_date',
  'end_date',
  'location',
  'campus',
  'registration_url',
  'cta_label',
  'cover_image_url',
  'gallery_urls',
  'author_id',
  'created_at',
  'updated_at',
].join(', ')

function map(row) {
  const gallery = Array.isArray(row.gallery_urls) ? row.gallery_urls : []
  return {
    id: row.id,
    title: row.title,
    category: row.category ?? '',
    description: row.description ?? '',
    body: row.body ?? '',
    date: row.event_date,
    endDate: row.end_date ?? null,
    location: row.location ?? '',
    campus: row.campus ?? '',
    registrationUrl: row.registration_url ?? '',
    ctaLabel: row.cta_label || 'Register',
    coverImageUrl: row.cover_image_url ?? '',
    galleryUrls: gallery.filter(Boolean),
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toRow(payload) {
  return {
    title: payload.title,
    category: payload.category || null,
    description: payload.description || null,
    body: payload.body || null,
    event_date: payload.date,
    end_date: payload.endDate || null,
    location: payload.location || null,
    campus: payload.campus || null,
    registration_url: payload.registrationUrl || null,
    cta_label: payload.ctaLabel || 'Register',
    cover_image_url: payload.coverImageUrl || null,
    gallery_urls: payload.galleryUrls ?? [],
  }
}

export async function fetchEventCategories() {
  const { data, error } = await supabase
    .from('events')
    .select('category')
    .not('category', 'is', null)
  if (error) throw error
  const set = new Set()
  for (const row of data ?? []) {
    const value = row.category?.trim()
    if (value) set.add(value)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select(SELECT_FIELDS)
    .order('event_date', { ascending: false })
  if (error) throw error
  return data.map(map)
}

export async function fetchEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()
  if (error) throw error
  return map(data)
}

export async function createEvent(payload, authorId) {
  const { data, error } = await supabase
    .from('events')
    .insert({ ...toRow(payload), author_id: authorId })
    .select(SELECT_FIELDS)
    .single()
  if (error) throw error
  return map(data)
}

export async function updateEvent(id, payload) {
  const { data, error } = await supabase
    .from('events')
    .update(toRow(payload))
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()
  if (error) throw error
  return map(data)
}

export async function deleteEvent(id) {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}
