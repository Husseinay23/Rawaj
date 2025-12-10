'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/build', label: 'Build' },
  { href: '/notes', label: 'Notes' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const logoSrc = theme === 'light' 
    ? '/brand/logo-light.jpeg' 
    : '/brand/logo-blue.png'

  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
  const textHoverColor = theme === 'light' ? 'hover:text-gray-900' : 'hover:text-gray-200'
  const activeColor = theme === 'light' ? 'bg-gray-900' : 'bg-white'
  const navBg = theme === 'light' 
    ? 'bg-white/95 border-gray-100' 
    : 'bg-gray-900/95 border-gray-800'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${navBg} backdrop-blur-md shadow-sm border-b`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              className="relative h-10 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={logoSrc}
                alt="Rawaj Logo"
                width={120}
                height={40}
                className="h-full w-auto object-contain"
                priority
              />
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative"
                >
                  <motion.span
                    className={`text-sm font-medium transition-colors ${
                      isActive ? textColor : `${textColor} ${textHoverColor} opacity-80`
                    }`}
                    whileHover={{ y: -1 }}
                  >
                    {link.label}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 ${activeColor}`}
                      layoutId="navbar-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} ${textColor} transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className={`p-2 rounded-md ${textColor} hover:opacity-80`}
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
