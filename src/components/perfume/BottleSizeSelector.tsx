'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePerfumeStore, type BottleSize } from '@/store/perfumeStore'
import { supabase } from '@/lib/supabaseClient'

export default function BottleSizeSelector() {
  const { selectedBottleSize, setBottleSize } = usePerfumeStore()
  const [bottleSizes, setBottleSizes] = useState<BottleSize[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBottleSizes = async () => {
      try {
        const { data, error } = await supabase
          .from('bottle_sizes')
          .select('*')
          .order('price', { ascending: true })

        if (error) throw error
        
        // Fallback data if database is empty
        if (!data || data.length === 0) {
          console.warn('No bottle sizes found in database, using fallback data')
          setBottleSizes([
            { id: '1', size: '50ml', price: 89.99 },
            { id: '2', size: '100ml', price: 159.99 },
          ])
        } else {
          setBottleSizes(data)
        }
      } catch (error) {
        console.error('Error fetching bottle sizes:', error)
        // Fallback data on error
        setBottleSizes([
          { id: '1', size: '50ml', price: 89.99 },
          { id: '2', size: '100ml', price: 159.99 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBottleSizes()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="text-sm text-gray-500">Loading sizes...</p>
      </div>
    )
  }

  if (bottleSizes.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-6">Choose Your Size</h2>
        <p className="text-red-500">No bottle sizes available. Please check your database configuration.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Choose Your Size</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        {bottleSizes.map((size) => {
          const isSelected = selectedBottleSize?.id === size.id

          return (
            <motion.button
              key={size.id}
              onClick={() => setBottleSize(size)}
              className={`relative p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-purple-500"
                  layoutId="selectedBottleSize"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <div className="text-2xl font-bold mb-2">{size.size}</div>
                <div className="text-lg text-gray-600">
                  ${size.price.toFixed(2)}
                </div>
              </div>
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

