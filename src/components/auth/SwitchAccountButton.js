'use client'

import { useAuth } from '@/hooks/useAuth'

export default function SwitchAccountButton() {
  const { switchAccount, authAction } = useAuth()
  return <button type="button" disabled={Boolean(authAction)}
    className="w-full px-4 py-2 text-sm border border-border rounded-lg disabled:opacity-50"
    onClick={switchAccount}>
    {authAction === 'switch' ? 'Opening Google…' : 'Switch Google account'}
  </button>
}
