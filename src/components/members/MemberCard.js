import Image from 'next/image'
import Link from 'next/link'

export default function MemberCard({ member }) {
  const {
    id,
    firstName,
    lastName,
    nickname,
    avatarUrl,
    school,
    occupation,
    status,
    role,
    linkedinUrl,
    githubUrl,
  } = member

  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim()
  const displayName = nickname ? `${fullName} (${nickname})` : fullName
  const initial = (firstName?.[0] ?? '?').toUpperCase()

  const hasSocials = linkedinUrl || githubUrl

  return (
    <div className="flex flex-col items-center text-center px-4 py-5 w-full max-w-[200px]">
      {/* Avatar */}
      <Link href={`/members/${id}`} className="group">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={64}
            height={64}
            className="rounded-full object-cover group-hover:ring-2 group-hover:ring-accent"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm group-hover:ring-2 group-hover:ring-accent">
            {initial}
          </div>
        )}
      </Link>

      {/* Name */}
      <Link
        href={`/members/${id}`}
        className="mt-2.5 font-inter font-medium text-sm text-text-primary hover:underline"
      >
        {displayName}
      </Link>

      {/* School */}
      <p className="mt-1 font-inter text-xs text-text-secondary">{school}</p>

      {/* Work — only if set */}
      {occupation && (
        <p className="mt-0.5 font-inter text-xs text-text-secondary">{occupation}</p>
      )}

      {/* Status badge */}
      <span
        className={`mt-2 text-[11px] px-2 py-0.5 rounded ${
          status === 'student'
            ? 'bg-[#F0F4FF] text-link'
            : 'bg-bg-elevated text-text-secondary'
        }`}
      >
        {status === 'student' ? 'Student' : 'Graduate'}
      </span>

      {/* Role badge — only if Executive */}
      {(role?.toLowerCase() === 'executive' || role?.toLowerCase() === 'admin') && (
        <span className="mt-1 text-[11px] px-2 py-0.5 rounded bg-[#EAF4F0] text-success">
          Executive
        </span>
      )}

      {/* Social icons — only if any link exists */}
      {hasSocials && (
        <div className="mt-2 flex gap-2">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${displayName} on LinkedIn`}
              className="text-text-secondary hover:text-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM8 19H5V8h3v11zM6.5 6.7c-1 0-1.7-.8-1.7-1.7s.8-1.7 1.7-1.7 1.7.8 1.7 1.7-.7 1.7-1.7 1.7zM20 19h-3v-5.6c0-1.4-.5-2.3-1.8-2.3-1 0-1.6.7-1.8 1.3-.1.2-.1.5-.1.8V19h-3V8h3v1.3c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1V19z" />
              </svg>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${displayName} on GitHub`}
              className="text-text-secondary hover:text-text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.7.9 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
