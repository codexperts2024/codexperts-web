'use client'

import { signInWithGoogle } from '@/services/authService'
import Button from '@/components/ui/Button'

export default function JoinButton({ className }) {
  return (
    <Button
      onClick={() => signInWithGoogle()}
      className={className}
    >
      Join Us <span>→</span>
    </Button>
  )
}
