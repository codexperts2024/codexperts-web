'use client'

import { signInWithGoogle } from '@/services/authService'
import Button from '@/components/ui/Button'

export default function JoinUsButton({ className }) {
  async function handleClick() {
    try {
      await signInWithGoogle(`${window.location.origin}/auth/callback`)
    } catch {
      // OAuth redirect failed
    }
  }

  return (
    <Button onClick={handleClick} className={className}>
      Join Us <span>→</span>
    </Button>
  )
}
