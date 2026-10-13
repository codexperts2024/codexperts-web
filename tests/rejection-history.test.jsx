import React from 'react'
import { afterEach, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import MemberTable from '@/app/admin/_components/MemberTable'
import { hasRejectionHistory, mergeReviewedMember } from '@/services/adminService'

afterEach(cleanup)
const history = [
  { id: 2, reason: 'Second decision', rejected_at: '2026-10-08T12:00:00Z', reviewer_name: 'Reviewer Two' },
  { id: 1, reason: 'Original decision', rejected_at: '2026-10-07T12:00:00Z', reviewer_name: 'Reviewer One' },
]
test.each(['pending', 'approved'])('history remains available when the application is %s', status => {
  const member = { id: 'one', firstName: 'Applicant', role: status === 'approved' ? 'member' : 'pending', applicationStatus: status, rejectionHistory: history }
  expect(hasRejectionHistory(member)).toBe(true)
  render(<MemberTable members={[member]} rejectedOnly isAdmin />)
  expect(screen.getByText('Original decision')).toBeTruthy()
  expect(screen.getByText('Second decision')).toBeTruthy()
  expect(screen.getByText(/Reviewer One/)).toBeTruthy()
  expect(screen.getByText(`Current application: ${status === 'approved' ? 'Approved' : 'Pending review'}`)).toBeTruthy()
})
test('mutation response without history cannot erase past decisions', () => {
  const merged = mergeReviewedMember({ rejectionHistory: history, rejectedAt: history[0].rejected_at }, { applicationStatus: 'approved', rejectionHistory: [], rejectedAt: null })
  expect(merged.rejectionHistory).toEqual(history)
  expect(hasRejectionHistory(merged)).toBe(true)
})
test('legacy rejection without records remains visible', () => {
  expect(hasRejectionHistory({ applicationStatus: 'rejected', rejectionHistory: [] })).toBe(true)
  expect(hasRejectionHistory({ applicationStatus: 'approved', rejectionHistory: [] })).toBe(false)
})
