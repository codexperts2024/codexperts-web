import { useState } from 'react'

const ROLE_BADGE = {
  pending:   { label: 'P', className: 'bg-bg-layer1 text-text-hint' },
  member:    { label: 'M', className: 'bg-link-bg text-link' },
  executive: { label: 'E', className: 'bg-purple-100 text-purple-600' },
  admin:     { label: 'A', className: 'bg-accent-bg text-accent' },
}

export default function UserAvatar({ avatarUrl, firstName, role }) {
  const [imgError, setImgError] = useState(false)
  const badge = ROLE_BADGE[role] ?? null
  const initial = (firstName || '?')[0].toUpperCase()

  return (
    <div className="flex items-center gap-1.5">
      <div className="h-8 w-8 rounded-full overflow-hidden bg-bg-surface flex items-center justify-center shrink-0 ring-1 ring-border">
        {avatarUrl && !imgError ? (
          <img
            src={avatarUrl}
            alt={firstName || 'avatar'}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-sm font-medium text-text-secondary select-none">{initial}</span>
        )}
      </div>
      {badge && (
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${badge.className}`}>
          {badge.label}
        </span>
      )}
    </div>
  )
}
