'use client'

import { useState } from 'react'
import UserAvatar from '@/components/common/UserAvatar'
import { cohortLabel } from '@/utils/cohort'
import { isPendingApplicant } from '@/services/adminService'

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

export default function MemberTable({
  members,
  selectedId,
  isAdmin,
  actionLoadingId,
  onSelect,
  onApprove,
  onReject,
}) {
  const [rejectTarget, setRejectTarget] = useState(null)
  const pendingCount = members.filter(isPendingApplicant).length

  return (
    <>
      <div className="border border-border rounded-lg bg-bg-surface overflow-hidden flex flex-col max-h-[calc(100vh-12rem)] min-h-[320px]">
        <div className="px-4 py-3 border-b border-border bg-bg-layer1 flex items-center justify-between shrink-0">
          <p className="text-sm font-inter text-text-secondary">
            {members.length} members
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                {pendingCount} pending
              </span>
            )}
          </p>
          {isAdmin && (
            <p className="text-xs text-text-hint font-inter hidden sm:block">Click a row to edit</p>
          )}
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse text-sm font-inter">
            <thead className="sticky top-0 z-10 bg-bg-layer1">
              <tr className="border-b border-border text-left text-xs text-text-hint">
                <th className="py-2.5 px-3 font-medium w-36">Member</th>
                <th className="py-2.5 px-3 font-medium">Email</th>
                <th className="py-2.5 px-3 font-medium hidden md:table-cell">School</th>
                <th className="py-2.5 px-3 font-medium hidden lg:table-cell">Cohort</th>
                <th className="py-2.5 px-3 font-medium w-24">Role</th>
                <th className="py-2.5 px-3 font-medium hidden sm:table-cell w-24">Status</th>
                <th className="py-2.5 px-3 font-medium hidden xl:table-cell w-28">Applied</th>
                <th className="py-2.5 px-3 font-medium w-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-text-hint">
                    No members found.
                  </td>
                </tr>
              ) : members.map(member => {
                const pending = isPendingApplicant(member)
                const isSelected = selectedId === member.id
                const isLoading = actionLoadingId === member.id

                return (
                  <tr
                    key={member.id}
                    onClick={() => isAdmin && !pending && onSelect(member)}
                    className={`border-b border-border transition-colors ${
                      pending ? 'bg-warning/5' : ''
                    } ${
                      isAdmin && !pending ? 'cursor-pointer hover:bg-bg-layer1' : ''
                    } ${isSelected ? 'bg-link-bg/40' : ''}`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <UserAvatar
                          avatarUrl={member.avatarUrl}
                          firstName={member.firstName}
                          role={member.role}
                        />
                        <span className="text-text-primary truncate">
                          {[member.firstName, member.lastName].filter(Boolean).join(' ') || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-text-secondary truncate max-w-[180px]">{member.email ?? '—'}</td>
                    <td className="py-2.5 px-3 text-text-secondary hidden md:table-cell">{member.school ?? '—'}</td>
                    <td className="py-2.5 px-3 text-text-secondary hidden lg:table-cell">
                      {member.cohort ? cohortLabel(member.cohort) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-text-primary">{formatRole(member.role)}</td>
                    <td className="py-2.5 px-3 text-text-secondary hidden sm:table-cell">{formatStatus(member.status)}</td>
                    <td className="py-2.5 px-3 text-text-hint hidden xl:table-cell">{formatDate(member.createdAt)}</td>
                    <td className="py-2.5 px-3">
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
                            onClick={() => setRejectTarget(member)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium border border-border-strong text-text-secondary hover:bg-bg-layer1 disabled:opacity-50 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-right text-xs text-text-hint">—</div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-bg-surface rounded-lg p-6 max-w-sm w-full shadow-lg border border-border">
            <p className="font-inter text-base text-text-primary mb-2">Reject this application?</p>
            <p className="text-sm text-text-secondary mb-6">
              {[rejectTarget.firstName, rejectTarget.lastName].filter(Boolean).join(' ')} will be removed from the pending queue. Their account stays in the database.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-bg-layer1 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoadingId === rejectTarget.id}
                onClick={async () => {
                  await onReject(rejectTarget.id)
                  setRejectTarget(null)
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
