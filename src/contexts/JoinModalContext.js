'use client'

import { createContext, useContext, useState } from 'react'

const JoinModalContext = createContext(null)

export function JoinModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <JoinModalContext.Provider value={{ isOpen, openModal: () => setIsOpen(true), closeModal: () => setIsOpen(false) }}>
      {children}
    </JoinModalContext.Provider>
  )
}

export function useJoinModal() {
  const ctx = useContext(JoinModalContext)
  if (!ctx) throw new Error('useJoinModal must be used within JoinModalProvider')
  return ctx
}
