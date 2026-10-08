'use client'

import { createContext, useCallback, useContext, useState } from 'react'

const JoinModalContext = createContext(null)

export function JoinModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  return (
    <JoinModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </JoinModalContext.Provider>
  )
}

export function useJoinModal() {
  const ctx = useContext(JoinModalContext)
  if (!ctx) throw new Error('useJoinModal must be used within JoinModalProvider')
  return ctx
}
