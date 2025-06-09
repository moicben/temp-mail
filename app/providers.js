'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { EmailProvider } from '@/contexts/EmailContext'

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <EmailProvider>
        {children}
      </EmailProvider>
    </ThemeProvider>
  )
} 