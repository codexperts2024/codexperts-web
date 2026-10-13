'use client'

import { useMemo, useState } from 'react'
import UserAvatar from '@/components/common/UserAvatar'
import Button from '@/components/ui/Button'
import { cohortLabel } from '@/utils/cohort'
import { downloadMembersCsv } from '@/utils/membersCsv'
import { isPendingApplicant } from '@/services/adminService'
import {
  compareNumberLike,
  compareText,
  sortIndicator,
  toggleSort,
} from '@/utils/memberSort'

function formatStatus(status) {
  if (!status || status === 'student') return 'Student'
  return 'Graduate'
}

function formatRole(role) {
  if (role === 'executive') return 'Executive'
  if (role === 'admin') return 'Admin'
  if (role === 'pending') return 'Pending'
  return 'Member'
}

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

function memberName(member) {
  return [member.firstName, member.lastName].filter(Boolean).join(' ')
}

function compareMembers(a, b, key, dir) {
  let result = 0

  switch (key) {
    case 'name':
      result = compareText(memberName(a), memberName(b))
      break
    case 'email':
      result = compareText(a.email, b.email)
      break
    case 'school':
      result = compareText(a.school, b.school)
      break
    case 'cohort':
      result = compareNumberLike(a.cohort, b.cohort)
      break
    case 'role':
      result = compareText(formatRole(a.role), formatRole(b.role))
        || compareText(a.executiveTitle, b.executiveTitle)
      break
    case 'status':
      result = compareText(formatStatus(a.status), formatStatus(b.status))
      break
    case 'rejectedAt':
      result = new Date(a.rejectedAt || 0) - new Date(b.rejectedAt || 0)
      break
    case 'createdAt':
      result = new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      break
    default:
      result = 0
  }

  if (result === 0 && key !== 'name') {
    result = compareText(memberName(a), memberName(b))
  }

  return dir === 'asc' ? result : -result
}

function SortHeader({ label, sortKey, activeKey, activeDir, onSort, className = '' }) {
  return (
    <th className={`py-2.5 px-3 font-medium ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="text-left hover:text-text-primary transition-colors"
      >
        {label}{sortIndicator(activeKey, activeDir, sortKey)}
      </button>
    </th>
  )
}

export default function MemberTable({
  members,
  selectedId,
  isAdmin,
  actionLoadingId,
  onSelect,
  onApprove,
  onReject,
  rejectedOnly = false,
}) {
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionError, setRejectionError] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [sortKey, setSortKey] = useState(rejectedOnly ? 'rejectedAt' : 'name')
  const [sortDir, setSortDir] = useState(rejectedOnly ? 'desc' : 'asc')
  const pendingCount = members.filter(isPendingApplicant).length

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      // Keep pending applicants pinned to the top regardless of column sort
      const aPending = isPendingApplicant(a)
      const bPending = isPendingApplicant(b)
      if (!rejectedOnly && aPending !== bPending) return aPending ? -1 : 1
      return compareMembers(a, b, sortKey, sortDir)
    })
  }, [members, sortKey, sortDir, rejectedOnly])

  function handleSort(key) {
    const next = toggleSort(sortKey, sortDir, key)
    setSortKey(next.key)
    setSortDir(next.dir)
  }

  return (
    <>
      <div className="border border-border rounded-lg bg-bg-surface overflow-hidden flex flex-col max-h-[calc(100vh-12rem)] min-h-[320px]">
        <div className="px-4 py-3 border-b border-border bg-bg-layer1 flex items-center justify-between shrink-0">
          <p className="text-sm font-inter text-text-secondary">
            {members.length} {rejectedOnly ? 'applications with rejection history' : 'members / applications'}
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                {pendingCount} pending
              </span>
            )}
          </p>
          {isAdmin && (
            <div className="flex items-center gap-3">
              <p className="text-xs text-text-hint font-inter hidden sm:block">
                {rejectedOnly ? 'Click headers to sort' : 'Click a name to edit · click headers to sort'}
              </p>
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-1.5 text-xs shrink-0"
                disabled={members.length === 0}
                onClick={() => downloadMembersCsv(members)}
              >
                Export CSV
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse text-sm font-inter">
            <thead className="sticky top-0 z-10 bg-bg-layer1">
              <tr className="border-b border-border text-left text-xs text-text-hint">
                <SortHeader label="Member" sortKey="name" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} className="w-36" />
                <SortHeader label="Email" sortKey="email" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} />
                <SortHeader label="School" sortKey="school" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} className="hidden md:table-cell" />
                <SortHeader label="Cohort" sortKey="cohort" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} className="w-28" />
                <SortHeader label="Role" sortKey="role" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} className="w-24" />
                <SortHeader label="Status" sortKey="status" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} className="hidden sm:table-cell w-24" />
                <SortHeader label="Applied" sortKey="createdAt" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} className="hidden xl:table-cell w-28" />
                {rejectedOnly ? <>
                  <SortHeader label="Rejected on" sortKey="rejectedAt" activeKey={sortKey} activeDir={sortDir} onSort={handleSort} />
                  <th className="py-2.5 px-3 font-medium">Rejection history / current status</th>
                </> : <th className="py-2.5 px-3 font-medium w-40 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sortedMembers.length === 0 ? (
                <tr>
                  <td colSpan={rejectedOnly ? 9 : 8} className="py-16 text-center text-text-hint">
                    {rejectedOnly ? 'No rejected applications.' : 'No members found.'}
                  </td>
                </tr>
              ) : sortedMembers.map(member => {
                const pending = isPendingApplicant(member)
                const isSelected = selectedId === member.id
                const isLoading = actionLoadingId === member.id

                return (
                  <tr
                    key={member.id}
                    className={`border-b border-border transition-colors ${
                      pending ? 'bg-warning/5' : ''
                    } ${isSelected ? 'bg-link-bg/40' : ''}`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <UserAvatar
                          avatarUrl={member.avatarUrl}
                          firstName={member.firstName}
                          role={member.role}
                        />
                        {isAdmin && !rejectedOnly ? (
                          <button
                            type="button"
                            onClick={() => onSelect(member)}
                            className="text-text-primary truncate text-left hover:text-link hover:underline transition-colors"
                          >
                            {memberName(member) || member.email || 'Edit application'}
                          </button>
                        ) : (
                          <span className="text-text-primary truncate">
                            {memberName(member) || '—'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-text-secondary truncate max-w-[180px]">{member.email ?? '—'}<div className="text-xs text-text-hint">{member.major || 'Major not provided'} · Discord: {member.discordJoined ? 'Joined (self-reported)' : 'Not confirmed'}</div></td>
                    <td className="py-2.5 px-3 text-text-secondary hidden md:table-cell">{member.school ?? '—'}</td>
                    <td className="py-2.5 px-3 text-text-secondary">
                      {member.cohort ? cohortLabel(member.cohort) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-text-primary">
                      <span>{member.applicationStatus === 'rejected' ? 'Rejected' : member.applicationStatus === 'draft' ? 'Not submitted' : formatRole(member.role)}</span>
                      {member.executiveTitle && (
                        <span className="block text-xs text-text-hint mt-0.5">{member.executiveTitle}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-text-secondary hidden sm:table-cell">{formatStatus(member.status)}</td>
                    <td className="py-2.5 px-3 text-text-hint hidden xl:table-cell">{formatDate(member.createdAt)}</td>
                    {rejectedOnly ? <>
                      <td className="py-2.5 px-3 whitespace-nowrap">{member.rejectedAt ? formatDate(member.rejectedAt) : 'Not recorded'}</td>
                      <td className="py-2.5 px-3 whitespace-pre-wrap break-words min-w-[220px] max-w-md"><p className="mb-2 font-medium">Current application: {member.applicationStatus === 'pending' ? 'Pending review' : member.applicationStatus === 'approved' ? 'Approved' : member.applicationStatus === 'draft' ? 'Not submitted' : 'Rejected'}</p>
                        {member.rejectionHistory?.length ? <details>
                          <summary className="cursor-pointer">{member.rejectionHistory.length} rejection decision(s)</summary>
                          <ol className="mt-2 space-y-3">
                            {member.rejectionHistory.map((decision, index) => <li key={decision.id ?? index}>
                              <p>{decision.reason}</p>
                              <p className="text-xs text-text-hint">{decision.rejected_at ? new Date(decision.rejected_at).toLocaleString() : 'Not recorded'} · {decision.reviewer_name || 'Reviewer unavailable'}</p>
                            </li>)}
                          </ol>
                        </details> : member.rejectionReason || 'No reason recorded (earlier decision)'}</td>
                    </> : <td className="py-2.5 px-3">
                      {pending ? (
                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => onApprove(member.id)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium bg-success text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                          >
                            {isLoading ? '…' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => { setRejectTarget(member); setRejectionReason(''); setRejectionError('') }}
                            className="px-3 py-1.5 rounded-md text-xs font-medium border border-border-strong text-text-secondary hover:bg-bg-layer1 disabled:opacity-50 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-right text-xs text-text-hint">—</div>
                      )}
                    </td>}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div role="dialog" aria-modal="true" aria-labelledby="reject-title" className="bg-bg-surface rounded-lg p-6 max-w-sm w-full shadow-lg border border-border">
            <p id="reject-title" className="font-inter text-base text-text-primary mb-2">Reject this application?</p>
            <p className="text-sm text-text-secondary mb-6">
              {[rejectTarget.firstName, rejectTarget.lastName].filter(Boolean).join(' ')} will move to the rejected applications list. The applicant will be able to see your reason.
            </p>
            <label htmlFor="rejection-reason" className="block text-sm mb-2">Reason for rejection *</label>
            <textarea id="rejection-reason" value={rejectionReason} maxLength={1000} disabled={rejecting}
              onChange={e => setRejectionReason(e.target.value)} rows={4}
              className="w-full border border-border rounded-md p-3 text-sm bg-bg-input mb-2" />
            <p className="text-xs text-text-hint mb-4">Visible to the applicant. Maximum 1,000 characters.</p>
            {rejectionError && <p role="alert" className="text-sm text-error mb-3">{rejectionError}</p>}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                disabled={rejecting}
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-layer1 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={rejecting || actionLoadingId === rejectTarget.id || !rejectionReason.trim()}
                onClick={async () => {
                  if (rejecting || !rejectionReason.trim()) return
                  setRejecting(true)
                  setRejectionError('')
                  try {
                    const saved = await onReject(rejectTarget.id, rejectionReason.trim())
                    if (saved) setRejectTarget(null)
                    else setRejectionError('Could not save the decision. Your reason has been kept. Please retry or reload the list to check its status.')
                  } catch (err) {
                    setRejectionError(err.message || 'Could not save the decision. Please retry.')
                  } finally { setRejecting(false) }
                }}
                className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium font-inter hover:bg-accent-hover disabled:opacity-50 transition-colors"
              >
                {actionLoadingId === rejectTarget.id ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
