'use client'

import { useAuth } from '@/hooks/useAuth'

export default function SwitchAccountButton({ variant = 'outline' }) {
  const { switchAccount, authAction } = useAuth()
  return <button type="button" disabled={Boolean(authAction)}
    className={`w-full text-sm disabled:opacity-50 ${variant === 'menu'
      ? 'block px-4 py-2 text-left text-text-secondary hover:text-text-primary hover:bg-bg-layer1 transition-colors'
      : 'px-4 py-2 border border-border rounded-lg'}`}
    onClick={switchAccount}>
    {authAction === 'switch' ? 'Opening Google…' : 'Switch Google account'}
  </button>
}
