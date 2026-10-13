import React from 'react'
import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import AccountMenu from '@/components/common/AccountMenu'

const mocks = vi.hoisted(() => ({ auth: {} }))
vi.mock('@/hooks/useAuth', () => ({ useAuth: () => mocks.auth }))

beforeEach(() => {
  mocks.auth = { switchAccount: vi.fn(), authAction: null }
})
afterEach(cleanup)

function renderMenu() {
  return render(
    <div>
      <AccountMenu profileHref="/members/one"><span>A</span></AccountMenu>
      <p>outside</p>
    </div>
  )
}

test('the switch account button stays hidden until the account chip is clicked', () => {
  renderMenu()
  expect(screen.queryByText('Switch Google account')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Account menu' }))
  expect(screen.getByText('Switch Google account')).toBeTruthy()
  expect(screen.getByText('My profile').getAttribute('href')).toBe('/members/one')
})

test('choosing switch account runs the switch action', () => {
  renderMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Account menu' }))
  fireEvent.click(screen.getByText('Switch Google account'))
  expect(mocks.auth.switchAccount).toHaveBeenCalledTimes(1)
})

test('Escape, an outside click, or the chip itself closes the menu', () => {
  renderMenu()
  const chip = screen.getByRole('button', { name: 'Account menu' })

  fireEvent.click(chip)
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByText('Switch Google account')).toBeNull()

  fireEvent.click(chip)
  fireEvent.mouseDown(screen.getByText('outside'))
  expect(screen.queryByText('Switch Google account')).toBeNull()

  fireEvent.click(chip)
  fireEvent.click(chip)
  expect(screen.queryByText('Switch Google account')).toBeNull()
})

test('opening the profile link closes the menu', () => {
  renderMenu()
  fireEvent.click(screen.getByRole('button', { name: 'Account menu' }))
  fireEvent.click(screen.getByText('My profile'))
  expect(screen.queryByText('Switch Google account')).toBeNull()
})
