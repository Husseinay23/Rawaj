'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export default function SplitHero() {
  const { theme } = useTheme()
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-300'
  const bgOverlay = theme === 'light' ? 'bg-gray-200/80' : 'bg-gray-800/80'

  return (
    <section className="min-h-screen flex items-center py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-12 md:gap-16">
          {/* Left Side: Text + Actions */}
          <motion.div
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold ${textColor} mb-6 leading-tight px-4 py-3 ${bgOverlay} rounded-lg backdrop-blur-sm block`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              Discover Your Signature Scent
            </motion.h1>

            <motion.p
              className={`text-lg md:text-xl ${textSecondary} mb-8 leading-relaxed px-4 py-3 ${bgOverlay} rounded-lg backdrop-blur-sm block`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            >
              Handcrafted blends tailored to your essence.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            >
              <Link href="/build">
                <motion.button
                  className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:bg-gray-800 transition-all"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Build Your Perfume
                </motion.button>
              </Link>

              <Link href="/notes">
                <motion.button
                  className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-900 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Notes
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Perfume Image */}
          <motion.div
            className="flex-1 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            <motion.div
              className="relative w-full max-w-md md:max-w-lg"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <img
                src="/hero/bottles-hero.png"
                alt="Premium Perfume Bottles"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

