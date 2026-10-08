'use client'

import { useCallback, useEffect, useState } from 'react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/hooks/useAuth'
import { ROLES } from '@/utils/constants'
import { formatRequestError } from '@/utils/requestErrors'
import {
  approveMember,
  fetchAdminMembers,
  isPendingApplicant,
  rejectMember,
  updateAdminMember,
} from '@/services/adminService'
import MemberTable from './_components/MemberTable'
import MemberEditPanel from './_components/MemberEditPanel'

export default function AdminPage() {
  const { profile, accessToken, loading: authLoading } = useAuth()
  const isAdmin = profile?.role === ROLES.ADMIN

  const [members, setMembers] = useState([])
  const [listView, setListView] = useState('active')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const loadMembers = useCallback(async () => {
    if (!accessToken) return
    setLoadError('')
    try {
      const data = await fetchAdminMembers(accessToken)
      setMembers(data)
    } catch (err) {
      setLoadError(formatRequestError(err))
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    if (authLoading) return
    if (!accessToken) {
      setLoading(false)
      setLoadError('Your session expired. Please refresh the page and log in again.')
      return
    }
    setLoading(true)
    loadMembers()
  }, [accessToken, authLoading, loadMembers])

  useEffect(() => {
    setSelectedMember(current => {
      if (!current) return null
      const fresh = members.find(m => m.id === current.id)
      if (!fresh) return null
      return fresh
    })
  }, [members])

  const closeEditor = useCallback(() => {
    setSelectedMember(null)
    setSaveError('')
  }, [])

  useEffect(() => {
    if (!selectedMember) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e) {
      if (e.key === 'Escape') closeEditor()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedMember, closeEditor])

  async function handleApprove(userId) {
    if (!accessToken) return
    setActionLoadingId(userId)
    try {
      const updated = await approveMember(accessToken, userId)
      setMembers(prev => prev.map(m => (m.id === userId ? updated : m)))
      if (selectedMember?.id === userId) setSelectedMember(null)
    } catch (err) {
      setLoadError(formatRequestError(err))
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleReject(userId, reason) {
    if (!accessToken) return
    setActionLoadingId(userId)
    try {
      const updated = await rejectMember(accessToken, userId, reason)
      setMembers(prev => prev.map(m => m.id === userId ? updated : m))
      if (selectedMember?.id === userId) setSelectedMember(null)
      return true
    } catch (err) {
      setLoadError(formatRequestError(err))
      return false
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleSave(form) {
    if (!selectedMember || !accessToken) return
    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateAdminMember(accessToken, selectedMember.id, form)
      setMembers(prev => prev.map(m => (m.id === updated.id ? updated : m)))
      closeEditor()
    } catch (err) {
      setSaveError(formatRequestError(err))
    } finally {
      setSaving(false)
    }
  }

  const pendingCount = members.filter(isPendingApplicant).length
  const rejectedCount = members.filter(m => m.applicationStatus === 'rejected').length
  const visibleMembers = members.filter(m => (m.applicationStatus === 'rejected') === (listView === 'rejected'))

  return (
    <RoleGuard>
      <main className="min-h-screen bg-bg-base">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-12 pb-8">
          <div className="mb-6">
            <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-text-primary">Admin</h1>
            <p className="text-sm text-text-secondary mt-1 font-inter">
              {isAdmin ? 'Member approvals and profile management' : 'Member approvals'}
            </p>
          </div>

          <div className="flex gap-2 mb-5" aria-label="Application lists">
            <button type="button" aria-pressed={listView === 'active'} onClick={() => { setListView('active'); closeEditor() }}
              className={`px-4 py-2 rounded-md text-sm border ${listView === 'active' ? 'bg-accent text-white' : 'border-border'}`}>
              Members & applications ({members.length - rejectedCount})
            </button>
            <button type="button" aria-pressed={listView === 'rejected'} onClick={() => { setListView('rejected'); closeEditor() }}
              className={`px-4 py-2 rounded-md text-sm border ${listView === 'rejected' ? 'bg-accent text-white' : 'border-border'}`}>
              Rejected applications ({rejectedCount})
            </button>
          </div>

          {loadError && (
            <div className="mb-4 px-4 py-3 rounded-lg border border-error/30 bg-error/5 text-sm text-error font-inter">
              {loadError}
            </div>
          )}

          {loading || authLoading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-text-primary" />
            </div>
          ) : (
            <MemberTable
              key={listView}
              rejectedOnly={listView === 'rejected'}
              members={visibleMembers}
              selectedId={selectedMember?.id}
              isAdmin={isAdmin}
              actionLoadingId={actionLoadingId}
              onSelect={setSelectedMember}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {!loading && listView === 'active' && pendingCount === 0 && !isAdmin && (
            <p className="mt-4 text-sm text-text-hint font-inter text-center">
              No pending approvals right now.
            </p>
          )}
        </div>

        {isAdmin && selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
            onClick={closeEditor}
            role="presentation"
          >
            <div
              className="w-full max-w-md"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-member-title"
            >
              <MemberEditPanel
                member={selectedMember}
                saving={saving}
                error={saveError}
                onSave={handleSave}
                onCancel={closeEditor}
              />
            </div>
          </div>
        )}
      </main>
    </RoleGuard>
  )
}
