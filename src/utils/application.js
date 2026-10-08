export function isDraftApplication(profile) {
  return !profile || (profile.role === 'pending' && profile.application_status === 'draft')
}

export function hasRequiredApplicationFields(profile) {
  return ['first_name', 'last_name', 'school', 'cohort', 'status', 'major']
    .every(key => typeof profile?.[key] === 'string' && profile[key].trim())
    && ['Seneca College', 'York University'].includes(profile.school)
    && ['student', 'graduate'].includes(profile.status)
    && /^[1-9][0-9]*$/.test(profile.cohort)
    && (!profile.phone || /^\(\d{3}\) \d{3}-\d{4}$/.test(profile.phone))
    && profile.major.trim().length <= 120
}

export function applicationMatches(profile, fields) {
  return profile?.application_status === 'pending'
    && Object.entries(fields).every(([key, value]) =>
      (profile[key] ?? '') === (value ?? ''))
}
