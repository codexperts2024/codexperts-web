import { cohortLabel } from '@/utils/cohort'

const FIRST_COHORT = { season: 'Fall', year: 2024 }
const SKIPPED_TERMS = new Set(['Summer 2025'])
const SEASON_ORDER = ['Winter', 'Summer', 'Fall']

function getCurrentTerm() {
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  if (month <= 4) return { season: 'Winter', year }
  if (month <= 8) return { season: 'Summer', year }
  return { season: 'Fall', year }
}

export function generateCohortOptions() {
  const current = getCurrentTerm()
  const cohorts = []
  let { season, year } = FIRST_COHORT

  while (true) {
    const term = `${season} ${year}`
    const isCurrent = season === current.season && year === current.year

    if (!SKIPPED_TERMS.has(term)) {
      const num = cohorts.length + 1
      cohorts.push({
        value: String(num),
        label: `${cohortLabel(num)} (Joined ${term}${isCurrent ? ' ← now' : ''})`,
      })
    }

    if (isCurrent) break

    const idx = SEASON_ORDER.indexOf(season)
    if (idx === 2) { season = 'Winter'; year += 1 }
    else season = SEASON_ORDER[idx + 1]
  }

  return cohorts.reverse()
}
