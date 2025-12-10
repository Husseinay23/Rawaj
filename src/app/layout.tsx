import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/ui/Navbar'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'Rawaj - Custom Perfume Builder',
  description: 'Create your perfect fragrance',
  icons: {
    icon: '/brand/icon.png',
    apple: '/brand/icon.png',
    shortcut: '/brand/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
