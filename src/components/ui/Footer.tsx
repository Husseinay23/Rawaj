'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()
  
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-300'
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700'
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-900'
  const hoverColor = theme === 'light' ? 'hover:text-gray-900' : 'hover:text-gray-200'
  
  const logoSrc = theme === 'light' 
    ? '/brand/logo-light.jpeg' 
    : '/brand/logo-blue.png'

  return (
    <footer className={`${bgColor} border-t ${borderColor}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src={logoSrc}
                alt="Rawaj Logo"
                width={100}
                height={33}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className={`text-sm ${textSecondary} max-w-xs`}>
              Handcrafted perfumes tailored to your essence. Create your signature scent with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold ${textColor} mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/build" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Build Your Perfume
                </Link>
              </li>
              <li>
                <Link href="/notes" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Explore Notes
                </Link>
              </li>
              <li>
                <Link href="/about" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`font-semibold ${textColor} mb-4`}>Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`font-semibold ${textColor} mb-4`}>Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  Twitter
                </a>
              </li>
              <li>
                <a href="mailto:hello@rawaj.com" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
                  hello@rawaj.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${borderColor} pt-8 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${textSecondary}`}>
            © {new Date().getFullYear()} Rawaj. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
              Privacy Policy
            </Link>
            <Link href="#" className={`text-sm ${textSecondary} ${hoverColor} transition-colors`}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
