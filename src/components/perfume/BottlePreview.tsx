'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePerfumeStore } from '@/store/perfumeStore'

export default function BottlePreview() {
  const { selectedBottleSize, selectedPerfume } = usePerfumeStore()

  const getBottleImage = () => {
    if (!selectedBottleSize) return '/bottles/placeholder.svg'
    const size = selectedBottleSize.size
    return size === '100ml' ? '/bottles/bottle-100ml.svg' : '/bottles/bottle-50ml.svg'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <motion.div
        className="relative w-48 h-64 md:w-64 md:h-80"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBottleSize?.id || 'no-size'}
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {/* Bottle Image */}
            <div className="relative w-full h-full">
              <img
                src={getBottleImage()}
                alt={`Perfume bottle ${selectedBottleSize?.size || 'placeholder'}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Label Overlay */}
            {selectedPerfume && (
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 bg-white/95 backdrop-blur-sm rounded px-3 py-2 shadow-lg border border-gray-200 z-30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <motion.div
                  key={selectedPerfume.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  <div className="text-xs font-bold text-center text-gray-800 truncate max-w-full">
                    {selectedPerfume.name}
                  </div>
                  <div className="text-[10px] text-center text-gray-600 truncate max-w-full">
                    {selectedPerfume.brand}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Size Badge */}
        {selectedBottleSize && (
          <motion.div
            className="absolute -top-4 -right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {selectedBottleSize.size}
          </motion.div>
        )}
      </motion.div>

      {/* Status Message */}
      {!selectedBottleSize && (
        <motion.p
          className="text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Select a bottle size to see preview
        </motion.p>
      )}
      {selectedBottleSize && !selectedPerfume && (
        <motion.p
          className="text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Choose an inspiration perfume to customize
        </motion.p>
      )}
    </div>
  )
}

