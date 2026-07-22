import { EXECUTIVE_TITLES, ROLES } from '@/utils/constants'

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function canHoldTitle(role) {
  return role === ROLES.EXECUTIVE || role === ROLES.ADMIN
}

/**
 * Keep executive_roles in sync with an admin member edit.
 * - One active title per user
 * - One active holder per (title, school)
 * - Assigning a taken seat ends the previous holder's term
 */
export async function syncExecutiveTitle(serviceClient, { userId, role, school, title }) {
  const nextTitle = canHoldTitle(role) && title ? title : null

  if (nextTitle && !EXECUTIVE_TITLES.includes(nextTitle)) {
    throw new Error('Invalid executive title')
  }

  if (nextTitle && !school) {
    throw new Error('School is required to assign an executive title')
  }

  const today = todayDate()

  const { data: userRoles, error: userRolesError } = await serviceClient
    .from('executive_roles')
    .select('id, title, school')
    .eq('user_id', userId)
    .is('end_date', null)

  if (userRolesError) throw new Error(userRolesError.message)

  const current = userRoles?.[0] ?? null

  if (!nextTitle) {
    if (userRoles?.length) {
      const { error } = await serviceClient
        .from('executive_roles')
        .update({ end_date: today })
        .eq('user_id', userId)
        .is('end_date', null)
      if (error) throw new Error(error.message)
    }
    return null
  }

  if (current && current.title === nextTitle && current.school === school) {
    return nextTitle
  }

  if (userRoles?.length) {
    const { error } = await serviceClient
      .from('executive_roles')
      .update({ end_date: today })
      .eq('user_id', userId)
      .is('end_date', null)
    if (error) throw new Error(error.message)
  }

  const { error: vacateError } = await serviceClient
    .from('executive_roles')
    .update({ end_date: today })
    .eq('title', nextTitle)
    .eq('school', school)
    .is('end_date', null)

  if (vacateError) throw new Error(vacateError.message)

  const { error: insertError } = await serviceClient
    .from('executive_roles')
    .insert({
      user_id: userId,
      title: nextTitle,
      school,
      start_date: today,
    })

  if (insertError) throw new Error(insertError.message)

  return nextTitle
}
