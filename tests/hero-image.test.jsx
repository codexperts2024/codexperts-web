import React from 'react'
import { renderToString } from 'react-dom/server'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import HomePage from '@/app/page'
import { getHeroImageUrl } from '@/lib/server/heroImage'

vi.mock('next/image', () => ({ default: ({ fill, priority, ...props }) => <img {...props} /> }))
vi.mock('next/script', () => ({ default: () => null }))
vi.mock('@/components/ui/JoinUsButton', () => ({ default: () => null }))
vi.mock('@/services/cloudinaryService', () => ({ getOptimizedUrl: url => url }))
vi.mock('@/components/home/HeroImageEditor', () => ({
  default: ({ onUpdate }) => <button onClick={() => onUpdate('/new-photo.jpg')}>Save photo</button>,
}))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

function mockSettings(value) {
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-test-key')
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ value }] })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

test('initial homepage HTML contains the saved hero without briefly rendering the old fallback', async () => {
  const request = mockSettings('/current-photo.jpg')
  const html = renderToString(await HomePage())
  expect(html).toContain('src="/current-photo.jpg"')
  expect(html).not.toContain('/hero.jpg')
  expect(request.mock.calls[0][1]).toMatchObject({ cache: 'no-store' })
  expect(request.mock.calls[0][1].signal).toBeDefined()
})

test('a later page request reads the replacement photo and editing updates the current page', async () => {
  const request = mockSettings('/current-photo.jpg')
  await HomePage()
  request.mockResolvedValueOnce({ ok: true, json: async () => [{ value: '/replacement.jpg' }] })
  render(await HomePage())
  expect(screen.getByRole('img').getAttribute('src')).toBe('/replacement.jpg')
  fireEvent.click(screen.getByRole('button', { name: 'Save photo' }))
  expect(screen.getByRole('img').getAttribute('src')).toBe('/new-photo.jpg')
})

test.each(['missing', 'http-error', 'timeout'])('homepage remains available when hero settings are %s', async failure => {
  const request = mockSettings(null)
  if (failure === 'http-error') request.mockResolvedValue({ ok: false })
  if (failure === 'timeout') request.mockRejectedValue(new DOMException('Timed out', 'TimeoutError'))
  expect(await getHeroImageUrl()).toBeNull()
  const html = renderToString(await HomePage())
  expect(html).toContain('src="/hero.jpg"')
  expect(html).toContain('Who We Are')
})
