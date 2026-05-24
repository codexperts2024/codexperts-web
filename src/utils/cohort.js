/**
 * Returns the ordinal label for a cohort number stored in the DB.
 * e.g. cohortLabel("1") → "1st Cohort"
 *      cohortLabel("3") → "3rd Cohort"
 *      cohortLabel("4") → "4th Cohort"
 */
export function cohortLabel(n) {
  const num = Number(n)
  if (!num) return ''
  if (num % 100 >= 11 && num % 100 <= 13) return `${num}th Cohort`
  switch (num % 10) {
    case 1: return `${num}st Cohort`
    case 2: return `${num}nd Cohort`
    case 3: return `${num}rd Cohort`
    default: return `${num}th Cohort`
  }
}
