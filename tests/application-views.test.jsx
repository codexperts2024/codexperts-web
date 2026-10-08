import React from 'react'
import { afterEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
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
