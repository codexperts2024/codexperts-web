import React from 'react'
import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import JoinModal from '@/components/common/JoinModal'

const mocks = vi.hoisted(() => ({
  auth: {}, modal: {}, push: vi.fn(), create: vi.fn(), fetch: vi.fn(),
}))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => mocks.auth }))
vi.mock('@/contexts/JoinModalContext', () => ({ useJoinModal: () => mocks.modal }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock('@/services/authService', () => ({ createProfile: mocks.create, fetchProfile: mocks.fetch, signInWithGoogle: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()
  sessionStorage.clear()
  mocks.auth = { user: { id: 'one', email: 'test@example.com', user_metadata: {} },
    profile: { id: 'one', role: 'pending', application_status: 'draft' }, loading: false, acceptProfile: vi.fn() }
  mocks.modal = { isOpen: true, openModal: vi.fn(), closeModal: vi.fn() }
})
afterEach(cleanup)

function fillForm() {
  fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Test' } })
  fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Applicant' } })
  const selects = screen.getAllByRole('combobox')
  fireEvent.change(selects[0], { target: { value: 'Seneca College' } })
  fireEvent.change(selects[1], { target: { value: '1' } })
  fireEvent.change(selects[2], { target: { value: 'student' } })
  fireEvent.change(screen.getByLabelText('Major / Program *'), { target: { value: 'Programming' } })
  fireEvent.change(screen.getByPlaceholderText('(416) 000-0000'), { target: { value: '4165550100' } })
}

test('Discord requires school and resets confirmation when school changes', () => {
  render(<JoinModal />)
  expect(screen.getByRole('checkbox').disabled).toBe(true)
  expect(screen.queryByRole('link')).toBeNull()
  fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'Seneca College' } })
  expect(screen.getByRole('link').href).toContain('QXuybeNpuN')
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'York University' } })
  expect(screen.getByRole('link').href).toContain('vKWWz8Q7us')
  expect(screen.getByRole('checkbox').checked).toBe(false)
})

test('failed submit keeps inputs, auth refresh does not overwrite draft, retry succeeds', async () => {
  mocks.create.mockRejectedValueOnce(new Error('Request timed out'))
  mocks.fetch.mockResolvedValue(mocks.auth.profile)
  const view = render(<JoinModal />)
  fillForm()
  mocks.auth = { ...mocks.auth, profile: { ...mocks.auth.profile } }
  view.rerender(<JoinModal />)
  expect(screen.getByPlaceholderText('John').value).toBe('Test')
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await screen.findByText(/Your entries have been kept/)
  expect(screen.getByPlaceholderText('John').value).toBe('Test')
  expect(mocks.push).not.toHaveBeenCalled()
  mocks.create.mockImplementationOnce(async fields => ({ id: 'one', ...fields, application_status: 'pending' }))
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/pending'))
  expect(mocks.create.mock.calls[1][0]).toMatchObject({ major: 'Programming', discord_joined: false })
})

test('lost response is reconciled only when the stored fields match', async () => {
  mocks.create.mockRejectedValueOnce(new Error('Request timed out'))
  mocks.fetch.mockImplementationOnce(async () => ({ id: 'one', ...mocks.create.mock.calls[0][0], application_status: 'pending' }))
  render(<JoinModal />)
  fillForm()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/pending'))
})

test('backdrop does not cancel; explicit cancel goes home, never pending', () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const view = render(<JoinModal />)
  fillForm()
  fireEvent.click(view.container.firstChild)
  expect(mocks.modal.closeModal).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(mocks.modal.closeModal).toHaveBeenCalled()
  expect(mocks.push).toHaveBeenCalledWith('/')
  expect(mocks.create).not.toHaveBeenCalled()
})

test('signup permits an empty phone but rejects an incomplete entered phone', async () => {
  mocks.create.mockImplementationOnce(async fields => ({ id: 'one', ...fields, application_status: 'pending' }))
  render(<JoinModal />)
  fillForm()
  fireEvent.change(screen.getByPlaceholderText('(416) 000-0000'), { target: { value: '123' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(mocks.create).not.toHaveBeenCalled()
  expect(screen.getByText('Enter a valid phone number: (XXX) XXX-XXXX')).toBeTruthy()
  fireEvent.change(screen.getByPlaceholderText('(416) 000-0000'), { target: { value: '' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/pending'))
  expect(mocks.create.mock.calls[0][0].phone).toBeNull()
})
