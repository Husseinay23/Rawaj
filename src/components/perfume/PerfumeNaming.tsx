'use client'

import { useState } from 'react'
import { usePerfumeStore } from '@/store/perfumeStore'
import { useTheme } from '@/contexts/ThemeContext'

export default function PerfumeNaming() {
  const { theme } = useTheme()
  const { customPerfumeName, setCustomPerfumeName, selectedBottleSize } = usePerfumeStore()
  const [showPreview, setShowPreview] = useState(false)

  const maxLength = 30
  const textColor = theme === 'light' ? 'text-[#1A1A1A]' : 'text-[#F8F8F8]'
  const textSecondary = theme === 'light' ? 'text-[#4A4A4A]' : 'text-[#D1D5DB]'
  const accentText = 'text-[#8B7355]'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Name Your Perfume</h2>
        <p className="text-gray-600 text-sm">
          Give your custom fragrance a unique name. This will appear on the bottle label.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={customPerfumeName}
            onChange={(e) => {
              const value = e.target.value.slice(0, maxLength)
              setCustomPerfumeName(value)
            }}
            placeholder="Enter your perfume name..."
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
            maxLength={maxLength}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {customPerfumeName.length}/{maxLength}
          </div>
        </div>

        {customPerfumeName.length > 0 && (
          <motion.div
            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-green-700">
              ✓ Great name! Your perfume will be called "{customPerfumeName}"
            </p>
          </motion.div>
        )}

        {/* Preview Toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`mt-4 px-4 py-2 text-sm ${accentText} hover:opacity-80 font-medium transition-opacity`}
        >
          {showPreview ? 'Hide' : 'Show'} Bottle Preview
        </button>

        {/* Bottle Preview with Name */}
        {showPreview && selectedBottleSize && (
          <div className="mt-6 flex justify-center">
            <div className="relative w-48 h-64">
              {/* Bottle Image Placeholder - Replace with actual bottle image */}
              <div className={`w-full h-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} rounded-t-full border-4 ${theme === 'light' ? 'border-gray-400' : 'border-gray-600'} flex items-end justify-center pb-8`}>
                {/* Label */}
                <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded px-3 py-2 shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-600'}`}>
                  <div className="text-center">
                    <div className={`text-xs font-bold ${textColor} truncate`}>
                      {customPerfumeName || 'Your Perfume Name'}
                    </div>
                    <div className={`text-[10px] ${textSecondary} mt-1`}>RAWAJ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">Naming Tips:</p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Keep it personal and meaningful</li>
          <li>Consider the mood or inspiration behind your blend</li>
          <li>Names can be in any language</li>
          <li>Special characters are allowed</li>
        </ul>
      </div>
    </div>
  )
}

