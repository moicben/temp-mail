import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://tempmail.example.com' : 'http://localhost:3000'),
  title: 'TempMail - Gestion d\'emails temporaires',
  description: 'Application de gestion d\'emails temporaires sécurisée avec interface moderne',
  keywords: 'email temporaire, temp mail, email jetable, sécurité, privacy',
  authors: [{ name: 'TempMail Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'TempMail - Gestion d\'emails temporaires',
    description: 'Application de gestion d\'emails temporaires sécurisée',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TempMail - Gestion d\'emails temporaires',
    description: 'Application de gestion d\'emails temporaires sécurisée',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' }
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100`}>
        <Providers>
          <div className="flex flex-col h-screen">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 