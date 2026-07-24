# Client Data Loading

> Rules for fetching data in client components so pages never hang on a spinner.
> Follow this for every new page and when editing existing loaders.

---

## Why loads hang

Most list/detail pages are `'use client'` and do this on mount:

1. `loading = true` (full-page spinner)
2. Await Supabase / API
3. `loading = false`

If the network stalls, auth session never resolves, or the user navigates away mid-request, step 3 may never run cleanly. That feels like an infinite load even when there is little data.

First visit to `codexperts.ca` is often slower for separate reasons:

- Cold start (Vercel + browser cache empty)
- `AuthProvider` waits on Supabase `getSession` / profile before navbar settles
- Home loads hero from Supabase and Elfsight social widgets from a third party

Timeouts do not remove network latency, but they stop the UI from spinning forever.

---

## Required pattern

Every client `useEffect` data load must:

1. **Abort on unmount** (do not update state after leave)
2. **Timeout at 15s** (then show an error, clear spinner)
3. **Surface errors** (never swallow failures into an endless spinner)

### Prefer these helpers

| Helper | When |
|--------|------|
| `createLoadGuard()` from `src/utils/loadGuard.js` | Supabase queries that accept `{ signal }` |
| `fetchWithTimeout()` from `src/utils/fetchWithTimeout.js` | `fetch()` / Next.js API routes |
| `withTimeout()` from `src/utils/withTimeout.js` | Promises without AbortSignal |

### Example (Supabase / service layer)

```js
import { createLoadGuard } from '@/utils/loadGuard'
import { fetchThings } from '@/services/thingsService'

useEffect(() => {
  const guard = createLoadGuard()

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchThings({ signal: guard.signal })
      if (!guard.isCancelled()) setThings(data)
    } catch (err) {
      if (!guard.isCancelled()) setError(guard.loadError(err, 'Failed to load things'))
    } finally {
      if (!guard.isCancelled()) setLoading(false)
    }
  }

  load()
  return () => guard.cleanup()
}, [])
```

### Service functions

Accept an optional `{ signal }` and pass it through:

```js
export async function fetchThings({ signal } = {}) {
  let query = supabase.from('things').select('*')
  if (signal) query = query.abortSignal(signal)
  const { data, error } = await query
  if (error) throw error
  return data
}
```

### Detail pages

Do **not** download the full list only to render one item.

- Fetch the single record by id
- If prev/next is needed, fetch a light id/date list — not every row’s body/media

---

## Checklist for new pages

- [ ] Loader uses `createLoadGuard`, `fetchWithTimeout`, or `withTimeout`
- [ ] Unmount cleanup aborts in-flight work
- [ ] Timeout shows a user-visible error and clears the spinner
- [ ] Detail routes use single-item fetch (+ light nav if needed)
- [ ] No `console.log` left in the loader
- [ ] Components call `services/` — no direct Supabase in JSX beyond existing exceptions being migrated

---

## Related

- `docs/guidelines/code-conventions.md` — services layer, async style
- `src/utils/loadGuard.js`
- `src/utils/fetchWithTimeout.js`
- `src/utils/withTimeout.js`
