// Keep announcement payloads bounded for storage and render performance.
export const ANNOUNCEMENT_TITLE_MAX = 200
export const ANNOUNCEMENT_CONTENT_MAX = 20000

export function getAnnouncementLengthError(title, content) {
  if ((title ?? '').length > ANNOUNCEMENT_TITLE_MAX) {
    return `Title must be ${ANNOUNCEMENT_TITLE_MAX} characters or fewer.`
  }
  if ((content ?? '').length > ANNOUNCEMENT_CONTENT_MAX) {
    return `Content must be ${ANNOUNCEMENT_CONTENT_MAX} characters or fewer.`
  }
  return null
}
