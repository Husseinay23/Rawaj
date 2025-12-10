'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

export default function BottlesSection() {
  const { theme } = useTheme()
  const bottles1Ref = useRef(null)
  const quoteRef = useRef(null)
  const maleRef = useRef(null)
  const femaleRef = useRef(null)

  const bottles1InView = useInView(bottles1Ref, { once: true, margin: '-100px' })
  const quoteInView = useInView(quoteRef, { once: true, margin: '-100px' })
  const maleInView = useInView(maleRef, { once: true, margin: '-100px' })
  const femaleInView = useInView(femaleRef, { once: true, margin: '-100px' })

  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white'
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-300'
  const bgOverlay = theme === 'light' ? 'bg-gray-200/80' : 'bg-gray-800/80'

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title and Bottles 1 - Animate from top */}
        <motion.div
          ref={bottles1Ref}
          initial={{ opacity: 0, y: -100 }}
          animate={bottles1InView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center mb-12"
        >
          <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-8 px-4 py-2 ${bgOverlay} rounded-lg backdrop-blur-sm block`}>
            Our Signature Collection
          </h2>
          <img
            src="/bottles/bottles-1.png"
            alt="Rawaj Perfume Bottles"
            className="max-w-md w-full h-auto object-contain shadow-2xl"
          />
        </motion.div>

        {/* Quote - Below bottles-1 */}
        <motion.div
          ref={quoteRef}
          initial={{ opacity: 0, y: 30 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <blockquote className={`text-2xl md:text-3xl font-medium italic ${textColor} leading-relaxed px-6 py-4 ${bgOverlay} rounded-lg backdrop-blur-sm block`}>
            "Every fragrance tells a story. Craft yours with Rawaj."
          </blockquote>
        </motion.div>

        {/* Male Bottle - From left */}
        <motion.div
          ref={maleRef}
          initial={{ opacity: 0, x: -100 }}
          animate={maleInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div className="flex justify-center md:justify-start">
            <img
              src="/bottles/bottle-male.png"
              alt="Male Perfume Bottle"
              className="max-w-md w-full h-auto object-contain shadow-2xl"
            />
          </div>
          <div className={`space-y-6 ${textColor} p-6 ${bgOverlay} rounded-lg backdrop-blur-sm`}>
            <h3 className="text-3xl md:text-4xl font-bold">For Him</h3>
            <p className={`text-lg ${textSecondary} leading-relaxed`}>
              Bold and sophisticated, our male fragrances blend rich base notes with
              crisp top notes to create a signature scent that commands attention.
            </p>
            <ul className={`space-y-3 ${textSecondary}`}>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Rich woody and spicy notes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Long-lasting formula</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Available in 50ml and 100ml</span>
              </li>
            </ul>
            <a
              href="/build"
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Build Your Fragrance
            </a>
          </div>
        </motion.div>

        {/* Female Bottle - From right */}
        <motion.div
          ref={femaleRef}
          initial={{ opacity: 0, x: 100 }}
          animate={femaleInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className={`space-y-6 ${textColor} order-2 md:order-1 p-6 ${bgOverlay} rounded-lg backdrop-blur-sm`}>
            <h3 className="text-3xl md:text-4xl font-bold">For Her</h3>
            <p className={`text-lg ${textSecondary} leading-relaxed`}>
              Elegant and enchanting, our female fragrances combine delicate floral
              notes with warm undertones to create a scent that's uniquely feminine.
            </p>
            <ul className={`space-y-3 ${textSecondary}`}>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Floral and fruity accords</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Elegant and sophisticated</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Available in 50ml and 100ml</span>
              </li>
            </ul>
            <a
              href="/build"
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Build Your Fragrance
            </a>
          </div>
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <img
              src="/bottles/bottle-female.png"
              alt="Female Perfume Bottle"
              className="max-w-md w-full h-auto object-contain shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

