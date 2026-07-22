import { supabase } from '@/lib/supabase'
import { getAnnouncementLengthError } from '@/utils/announcementLimits'

const SELECT_FIELDS = 'id, title, content, created_at, author_id, profiles(first_name, last_name)'

function map(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content ?? '',
    authorName: [row.profiles?.first_name, row.profiles?.last_name].filter(Boolean).join(' ') || 'Unknown',
    createdAt: row.created_at,
  }
}

function assertLength(title, content) {
  const error = getAnnouncementLengthError(title, content)
  if (error) throw new Error(error)
}

export async function fetchAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select(SELECT_FIELDS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(map)
}

export async function createAnnouncement(title, content, authorId) {
  assertLength(title, content)
  const { data, error } = await supabase
    .from('announcements')
    .insert({ title, content, author_id: authorId })
    .select(SELECT_FIELDS)
    .single()
  if (error) throw error
  return map(data)
}

export async function updateAnnouncement(id, title, content) {
  assertLength(title, content)
  const { data, error } = await supabase
    .from('announcements')
    .update({ title, content })
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()
  if (error) throw error
  return map(data)
}

export async function deleteAnnouncement(id) {
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw error
}
