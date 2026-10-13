import React from 'react'
import { afterEach, expect, test, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import MemberCard from '@/components/members/MemberCard'

afterEach(cleanup)

test('member cards respect hidden settings even when given owner data', () => {
  render(<MemberCard member={{ id: 'one', firstName: 'Test', lastName: 'Member',
    company: 'Private company', occupation: 'Private job',
    linkedinUrl: 'https://example.com/linkedin', githubUrl: 'https://example.com/github',
    profileVisibility: { company: false, occupation: false, linkedin: false, github: false },
  }} />)
  expect(screen.queryByText('Private company')).toBeNull()
  expect(screen.queryByText('Private job')).toBeNull()
  expect(screen.queryByRole('link', { name: /LinkedIn/ })).toBeNull()
  expect(screen.queryByRole('link', { name: /GitHub/ })).toBeNull()
})

test('legacy visible company fields still appear', () => {
  render(<MemberCard member={{ id: 'one', firstName: 'Test', company: 'Public company' }} />)
  expect(screen.getByText('Public company')).toBeTruthy()
})
