export function compareText(a, b) {
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { sensitivity: 'base' })
}

export function compareNumberLike(a, b) {
  const na = Number(a)
  const nb = Number(b)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return compareText(a, b)
}

export function toggleSort(currentKey, currentDir, nextKey) {
  if (currentKey === nextKey) {
    return { key: nextKey, dir: currentDir === 'asc' ? 'desc' : 'asc' }
  }
  return { key: nextKey, dir: 'asc' }
}

export function sortIndicator(activeKey, activeDir, key) {
  if (activeKey !== key) return ''
  return activeDir === 'asc' ? '(↑)' : '(↓)'
}
