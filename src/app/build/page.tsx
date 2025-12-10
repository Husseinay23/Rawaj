'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BottleSizeSelector from '@/components/perfume/BottleSizeSelector'
import InspirationSelector from '@/components/perfume/InspirationSelector'
import BottlePreview from '@/components/perfume/BottlePreview'
import PriceDisplay from '@/components/perfume/PriceDisplay'
import { usePerfumeStore } from '@/store/perfumeStore'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function BuildPage() {
  const { selectedBottleSize, selectedPerfume, estimatedPrice } = usePerfumeStore()
  const headerRef = useRef<HTMLDivElement>(null)
  const sizeSectionRef = useRef<HTMLDivElement>(null)
  const inspirationSectionRef = useRef<HTMLDivElement>(null)
  const previewSectionRef = useRef<HTMLDivElement>(null)
  const priceSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP fade-in animations on scroll
    const sections = [
      headerRef.current,
      sizeSectionRef.current,
      inspirationSectionRef.current,
      previewSectionRef.current,
      priceSectionRef.current,
    ]

    sections.forEach((section, index) => {
      if (section) {
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              end: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const handleContinue = () => {
    if (!selectedBottleSize || !selectedPerfume) {
      alert('Please select both a bottle size and an inspiration perfume')
      return
    }
    // Navigate to next step (e.g., notes selection)
    console.log('Continue with:', { selectedBottleSize, selectedPerfume })
    // You can add navigation here: router.push('/notes')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Build Your Perfume
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create a custom fragrance that's uniquely yours. Choose your size and
            inspiration to get started.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Selection */}
          <div className="space-y-12">
            {/* Bottle Size Selection */}
            <motion.div
              ref={sizeSectionRef}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <BottleSizeSelector />
            </motion.div>

            {/* Inspiration Perfume Selection */}
            <motion.div
              ref={inspirationSectionRef}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <InspirationSelector />
            </motion.div>
          </div>

          {/* Right Column: Preview */}
          <div className="space-y-8">
            {/* Bottle Preview */}
            <motion.div
              ref={previewSectionRef}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 min-h-[500px] flex items-center justify-center"
            >
              <BottlePreview />
            </motion.div>

            {/* Price Display */}
            <motion.div
              ref={priceSectionRef}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <PriceDisplay />
            </motion.div>

            {/* Continue Button */}
            <motion.div
              className="sticky bottom-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={handleContinue}
                disabled={!selectedBottleSize || !selectedPerfume}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                  selectedBottleSize && selectedPerfume
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={
                  selectedBottleSize && selectedPerfume
                    ? { scale: 1.02 }
                    : {}
                }
                whileTap={
                  selectedBottleSize && selectedPerfume
                    ? { scale: 0.98 }
                    : {}
                }
              >
                Continue to Notes Selection
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Progress Indicator */}
        <motion.div
          className="mt-12 flex items-center justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              selectedBottleSize ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
          <div
            className={`w-3 h-3 rounded-full ${
              selectedPerfume ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
          <div className="w-3 h-3 rounded-full bg-gray-300" />
        </motion.div>
      </div>
    </main>
  )
}
