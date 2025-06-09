'use client'

import { createContext, useContext, useState } from 'react'

const UserContext = createContext({})

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    autoRefresh: true,
    notifications: true
  })

  const value = {
    preferences,
    setPreferences
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
} 