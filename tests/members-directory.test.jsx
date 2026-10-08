import React from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import MembersPage from '@/app/members/page'
import ProfilePhotoEditor from '@/components/members/ProfilePhotoEditor'

const mocks = vi.hoisted(() => ({ upload: vi.fn() }))
vi.mock('@/components/auth/RoleGuard', () => ({ default: ({ children }) => children }))
vi.mock('@/components/members/MemberCard', () => ({ default: ({ member }) => <div data-testid="member">{member.firstName}</div> }))
vi.mock('@/services/membersService', () => ({ fetchMembers: async () => [
  { id: '1', firstName: 'Amy', role: 'member' },
  { id: '2', firstName: 'Zoe', role: 'admin' },
  { id: '3', firstName: 'Ben', role: 'executive' },
  { id: '4', firstName: null, lastName: '  ', role: 'member' },
  { id: '5', firstName: 'Carl', role: 'Executive' },
] }))
vi.mock('@/services/cloudinaryService', () => ({ uploadImage: mocks.upload }))
afterEach(() => { cleanup(); vi.clearAllMocks() })

test('directory hides blank names, puts leadership first, and includes admins in Executive filter', async () => {
  render(<MembersPage />)
  await screen.findByText('Amy')
  const names = () => screen.getAllByTestId('member').map(el => el.textContent)
  expect(names()).toEqual(['Ben', 'Carl', 'Zoe', 'Amy'])
  fireEvent.change(screen.getByLabelText('Filter by role'), { target: { value: 'executive' } })
  expect(names()).toEqual(['Ben', 'Carl', 'Zoe'])
  fireEvent.change(screen.getByLabelText('Filter by role'), { target: { value: '' } })
  fireEvent.change(screen.getByLabelText('Sort members'), { target: { value: 'name-asc' } })
  expect(names()).toEqual(['Amy', 'Ben', 'Carl', 'Zoe'])
})

test('photo editor updates the avatar only after saving and reports failures for retry', async () => {
  const saved = vi.fn()
  mocks.upload.mockRejectedValueOnce(new Error('Could not save')).mockResolvedValueOnce({ url: '/new.jpg' })
  render(<ProfilePhotoEditor onSaved={saved} />)
  const file = new File(['image'], 'photo.jpg', { type: 'image/jpeg' })
  fireEvent.change(screen.getByLabelText('Change profile photo'), { target: { files: [file] } })
  await screen.findByText('Could not save')
  expect(saved).not.toHaveBeenCalled()
  fireEvent.change(screen.getByLabelText('Change profile photo'), { target: { files: [file] } })
  await screen.findByText('Profile photo saved.')
  expect(saved).toHaveBeenCalledWith('/new.jpg')
})
