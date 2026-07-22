export function isEventUpcoming(event) {
  const now = new Date()
  const start = new Date(event.date)
  if (Number.isNaN(start.getTime())) return false

  // Past when end datetime has passed; if no end, past from midnight of the day after start.
  let cutoff
  if (event.endDate) {
    cutoff = new Date(event.endDate)
  } else {
    cutoff = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1, 0, 0, 0, 0)
  }
  if (Number.isNaN(cutoff.getTime())) return false
  return now < cutoff
}

/** Convert ISO / DB timestamp to value for <input type="datetime-local"> */
export function toDatetimeLocalValue(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

/** Convert datetime-local string to ISO for DB storage */
export function fromDatetimeLocalValue(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function formatEventDate(dateStr, endDateStr) {
  if (!dateStr) return ''
  const start = new Date(dateStr)
  if (Number.isNaN(start.getTime())) return ''

  const startDate = start.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const startTime = formatTime(start)

  if (!endDateStr) {
    return `${startDate} · ${startTime}`
  }

  const end = new Date(endDateStr)
  if (Number.isNaN(end.getTime())) {
    return `${startDate} · ${startTime}`
  }

  const endTime = formatTime(end)
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()

  if (sameDay) {
    return `${startDate} · ${startTime} – ${endTime}`
  }

  const endDate = end.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return `${startDate} · ${startTime} – ${endDate} · ${endTime}`
}
