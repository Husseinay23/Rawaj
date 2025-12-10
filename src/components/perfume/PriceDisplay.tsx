'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePerfumeStore } from '@/store/perfumeStore'

export default function PriceDisplay() {
  const { estimatedPrice } = usePerfumeStore()
  const [displayPrice, setDisplayPrice] = useState(0)

  useEffect(() => {
    if (estimatedPrice === null) {
      setDisplayPrice(0)
      return
    }

    // Count-up animation
    const duration = 800 // ms
    const steps = 60
    const increment = estimatedPrice / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setDisplayPrice(Math.min(increment * currentStep, estimatedPrice))
      } else {
        setDisplayPrice(estimatedPrice)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [estimatedPrice])

  if (estimatedPrice === null) {
    return null
  }

  return (
    <motion.div
      className="text-center space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-sm text-gray-600 uppercase tracking-wide">
        Estimated Price
      </div>
      <motion.div
        className="text-5xl font-bold text-purple-600"
        key={estimatedPrice}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        ${displayPrice.toFixed(2)}
      </motion.div>
    </motion.div>
  )
}

