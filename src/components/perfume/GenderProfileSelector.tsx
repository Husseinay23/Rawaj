'use client'

import { usePerfumeStore } from '@/store/perfumeStore'
import { useTheme } from '@/contexts/ThemeContext'
import type { GenderProfile } from '@/types'

const genderOptions: { value: GenderProfile; label: string; description: string }[] = [
  {
    value: 'masculine',
    label: 'Masculine',
    description: 'Bold, woody, and sophisticated scents',
  },
  {
    value: 'feminine',
    label: 'Feminine',
    description: 'Elegant, floral, and delicate fragrances',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    description: 'Versatile and balanced unisex blends',
  },
]

export default function GenderProfileSelector() {
  const { theme } = useTheme()
  const { genderProfile, setGenderProfile } = usePerfumeStore()
  
  const textColor = theme === 'light' ? 'text-[#1A1A1A]' : 'text-[#F8F8F8]'
  const textSecondary = theme === 'light' ? 'text-[#4A4A4A]' : 'text-[#D1D5DB]'
  const surfaceColor = theme === 'light' ? 'bg-white' : 'bg-[#1E293B]'
  const borderColor = theme === 'light' ? 'border-[#E5E5E5]' : 'border-[#334155]'
  const accentColor = 'bg-[#8B7355]'
  const accentBorder = 'border-[#8B7355]'

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-semibold mb-2 ${textColor}`}>Choose Your Gender Profile</h2>
        <p className={`${textSecondary} text-sm`}>
          This will help us recommend notes and create a fragrance that matches your preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {genderOptions.map((option) => {
          const isSelected = genderProfile === option.value

          return (
            <button
              key={option.value}
              onClick={() => setGenderProfile(option.value)}
              className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? `${accentBorder} ${accentColor} text-white`
                  : `${borderColor} ${surfaceColor} ${textColor} hover:opacity-80`
              }`}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">{option.label}</h3>
                <p className={`text-sm ${isSelected ? 'text-white/90' : textSecondary}`}>
                  {option.description}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#8B7355]"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

