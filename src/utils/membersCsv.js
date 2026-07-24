const CSV_COLUMNS = [
  { key: 'id', header: 'ID' },
  { key: 'firstName', header: 'First Name' },
  { key: 'lastName', header: 'Last Name' },
  { key: 'nickname', header: 'Nickname' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'school', header: 'School' },
  { key: 'cohort', header: 'Cohort' },
  { key: 'status', header: 'Status' },
  { key: 'role', header: 'Role' },
  { key: 'executiveTitle', header: 'Executive Title' },
  { key: 'applicationStatus', header: 'Application Status' },
  { key: 'occupation', header: 'Occupation' },
  { key: 'company', header: 'Company' },
  { key: 'linkedin', header: 'LinkedIn' },
  { key: 'github', header: 'GitHub' },
  { key: 'bio', header: 'Bio' },
  { key: 'avatarUrl', header: 'Avatar URL' },
  { key: 'createdAt', header: 'Created At' },
  { key: 'updatedAt', header: 'Updated At' },
]

function escapeCsvCell(value) {
  if (value == null) return ''
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function buildMembersCsv(members) {
  const header = CSV_COLUMNS.map(col => col.header).join(',')
  const rows = members.map(member =>
    CSV_COLUMNS.map(col => escapeCsvCell(member[col.key])).join(',')
  )
  // UTF-8 BOM so Excel opens Korean / special characters correctly
  return `\uFEFF${[header, ...rows].join('\n')}`
}

export function downloadMembersCsv(members, filename) {
  const csv = buildMembersCsv(members)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = filename ?? `codexperts-members-${stamp}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
