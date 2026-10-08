'use client'

import { useState } from 'react'
import { switchGoogleAccount } from '@/services/authService'

export default function SwitchAccountButton() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return <div>
    <button type="button" disabled={busy} className="w-full px-4 py-2 text-sm border border-border rounded-lg disabled:opacity-50"
      onClick={async () => {
        setBusy(true)
        setError('')
        try { await switchGoogleAccount() }
        catch { setError('Could not switch accounts. Please try signing in again.'); setBusy(false) }
      }}>{busy ? 'Opening Google…' : 'Switch Google account'}</button>
    {error && <p role="alert" className="text-sm text-error">{error}</p>}
  </div>
}
