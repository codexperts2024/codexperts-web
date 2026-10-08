import React from 'react'
import { afterEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, within, waitFor } from '@testing-library/react'
import PendingPage from '@/app/pending/page'
import MemberTable from '@/app/admin/_components/MemberTable'

const mocks = vi.hoisted(() => ({ auth: {}, open: vi.fn(), replace: vi.fn() }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => mocks.auth }))
vi.mock('@/contexts/JoinModalContext', () => ({ useJoinModal: () => ({ openModal: mocks.open }) }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }))
afterEach(cleanup)

test.each([
  ['draft', 'Complete your application', 'Not submitted'],
  ['pending', 'Application received', 'Pending approval'],
  ['rejected', 'Application not approved', 'Not approved'],
])('application status %s is displayed truthfully', (status, heading, badge) => {
  mocks.auth = { user: { id: 'one' }, profile: { role: 'pending', application_status: status }, loading: false }
  render(<PendingPage />)
  expect(screen.getByRole('heading', { name: heading })).toBeTruthy()
  expect(screen.getByText(badge)).toBeTruthy()
})

test('admin can open an empty pending application for editing', () => {
  const select = vi.fn()
  const member = { id: 'one', email: 'test@example.com', role: 'pending', applicationStatus: 'pending' }
  render(<MemberTable members={[member]} isAdmin onSelect={select} />)
  fireEvent.click(screen.getByRole('button', { name: 'test@example.com' }))
  expect(select).toHaveBeenCalledWith(member)
})

test('drafts remain editable but never offer approval actions', () => {
  const member = { id: 'one', email: 'test@example.com', role: 'pending', applicationStatus: 'draft' }
  render(<MemberTable members={[member]} isAdmin onSelect={vi.fn()} />)
  expect(screen.getByRole('button', { name: 'test@example.com' })).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull()
  expect(screen.getByText('Not submitted')).toBeTruthy()
})

test('applicants see their rejection reason and date', () => {
  mocks.auth = { user: { id: 'one' }, profile: {
    role: 'pending', application_status: 'rejected', rejection_reason: 'Please confirm your campus.',
    rejected_at: '2026-10-08T15:00:00Z',
  }, loading: false }
  render(<PendingPage />)
  expect(screen.getByText('Please confirm your campus.')).toBeTruthy()
  expect(screen.getByText(/Rejected on/)).toBeTruthy()
})

test('rejected list includes old decisions with unknown details', () => {
  render(<MemberTable members={[{
    id: 'one', email: 'test@example.com', role: 'pending', applicationStatus: 'rejected',
  }]} isAdmin rejectedOnly />)
  expect(screen.getByText('Rejected')).toBeTruthy()
  expect(screen.getByText('Not recorded')).toBeTruthy()
  expect(screen.getByText('No reason recorded (earlier decision)')).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull()
})

test('rejection requires a reason and keeps it available when saving fails', async () => {
  const reject = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true)
  render(<MemberTable members={[{
    id: 'one', email: 'test@example.com', role: 'pending', applicationStatus: 'pending',
  }]} isAdmin onReject={reject} />)
  fireEvent.click(screen.getByRole('button', { name: 'Reject' }))
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByRole('button', { name: 'Reject' }).disabled).toBe(true)
  fireEvent.change(screen.getByLabelText('Reason for rejection *'), { target: { value: 'Please confirm your campus.' } })
  fireEvent.click(within(dialog).getByRole('button', { name: 'Reject' }))
  await screen.findByRole('alert')
  expect(screen.getByLabelText('Reason for rejection *').value).toBe('Please confirm your campus.')
  fireEvent.click(within(dialog).getByRole('button', { name: 'Reject' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  expect(reject).toHaveBeenLastCalledWith('one', 'Please confirm your campus.')
})
