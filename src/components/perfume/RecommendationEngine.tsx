'use client'

import { useState, useEffect } from 'react'
import { usePerfumeStore } from '@/store/perfumeStore'
import { useTheme } from '@/contexts/ThemeContext'
import { notesData } from '@/data/notes'
import type { Perfume } from '@/types'

export default function RecommendationEngine() {
  const { theme } = useTheme()
  const {
    selectedTopNotes,
    selectedMiddleNotes,
    selectedBaseNotes,
    genderProfile,
    selectedPerfume,
    setSelectedPerfume,
  } = usePerfumeStore()

  const [recommendations, setRecommendations] = useState<Perfume[]>([])
  const [loading, setLoading] = useState(false)
  const [showAutoBlend, setShowAutoBlend] = useState(false)

  const textColor = theme === 'light' ? 'text-[#1A1A1A]' : 'text-[#F8F8F8]'
  const textSecondary = theme === 'light' ? 'text-[#4A4A4A]' : 'text-[#D1D5DB]'
  const surfaceColor = theme === 'light' ? 'bg-white' : 'bg-[#1E293B]'
  const borderColor = theme === 'light' ? 'border-[#E5E5E5]' : 'border-[#334155]'
  const accentColor = 'bg-[#8B7355]'
  const accentText = 'text-[#8B7355]'

  useEffect(() => {
    if (
      selectedTopNotes.length > 0 ||
      selectedMiddleNotes.length > 0 ||
      selectedBaseNotes.length > 0
    ) {
      fetchRecommendations()
    }
  }, [selectedTopNotes, selectedMiddleNotes, selectedBaseNotes])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      // Get all selected note names
      const allNoteIds = [
        ...selectedTopNotes.map((n) => n.note_id),
        ...selectedMiddleNotes.map((n) => n.note_id),
        ...selectedBaseNotes.map((n) => n.note_id),
      ]

      // Fetch note names from local data
      const selectedNoteNames = notesData
        .filter((note) => allNoteIds.includes(note.id))
        .map((note) => note.name)

      if (selectedNoteNames.length === 0) {
        setRecommendations([])
        setLoading(false)
        return
      }

      // Call API to get recommendations
      const response = await fetch('/api/perfumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: selectedNoteNames }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.perfumes || [])
      } else {
        console.error('Failed to fetch recommendations')
        setRecommendations([])
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  const handleAutoBlend = () => {
    setShowAutoBlend(true)
    // In a real implementation, this would generate a custom blend
    // For now, we'll just show a message
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Recommendations</h2>
        <p className="text-gray-600 text-sm">
          Based on your selected notes, here are some perfumes that match your preferences.
        </p>
      </div>

      {/* Auto Blend Option */}
      <div className={`p-6 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'} rounded-xl border-2 ${borderColor}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold text-lg mb-1 ${textColor}`}>Auto-Generated Blend</h3>
            <p className={`text-sm ${textSecondary}`}>
              Let us create a custom blend based on your selected notes
            </p>
          </div>
          <button
            onClick={handleAutoBlend}
            className={`px-6 py-3 ${accentColor} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
          >
            Generate Blend
          </button>
        </div>
        {showAutoBlend && (
          <div className={`mt-4 p-4 ${surfaceColor} rounded-lg`}>
            <p className={`text-sm ${textColor}`}>
              Your custom blend has been generated! You can fine-tune the proportions in the next
              step.
            </p>
          </div>
        )}
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${accentText} border-t-transparent`}></div>
          <span className={`ml-3 ${textSecondary}`}>Finding recommendations...</span>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          <h3 className={`font-semibold ${textColor}`}>Similar Perfumes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((perfume) => {
              const isSelected = selectedPerfume?.id === perfume.id

              return (
                <button
                  key={perfume.id}
                  onClick={() => setSelectedPerfume(isSelected ? null : perfume)}
                  className={`p-4 rounded-lg border-2 text-left transition-opacity ${
                    isSelected
                      ? `${borderColor} ${accentColor} text-white`
                      : `${borderColor} ${surfaceColor} ${textColor} hover:opacity-80`
                  }`}
                >
                  <div className="font-semibold text-lg mb-1">{perfume.name || 'Unnamed'}</div>
                  <div className={`text-sm ${textSecondary} mb-2`}>{perfume.brand || ''}</div>
                  {perfume.description && (
                    <div className={`text-xs ${textSecondary} line-clamp-2`}>{perfume.description}</div>
                  )}
                  {isSelected && (
                    <div className={`mt-2 text-sm ${isSelected ? 'text-white' : accentText} font-medium`}>
                      ✓ Selected as inspiration
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className={`text-center py-8 ${textSecondary}`}>
          <p>No recommendations found. Try selecting more notes.</p>
        </div>
      )}

      {/* Scent Pyramid Visualization */}
      {(selectedTopNotes.length > 0 ||
        selectedMiddleNotes.length > 0 ||
        selectedBaseNotes.length > 0) && (
        <div className={`mt-6 p-6 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'} rounded-xl`}>
          <h3 className={`font-semibold mb-4 ${textColor}`}>Your Scent Pyramid</h3>
          <div className="space-y-3">
            {/* Base Notes */}
            {selectedBaseNotes.length > 0 && (
              <div>
                <div className={`text-xs font-medium ${textSecondary} mb-1`}>Base Notes</div>
                <div className="h-8 bg-amber-600 rounded flex items-center justify-center text-white text-xs font-medium">
                  {selectedBaseNotes
                    .map((n) => {
                      const note = notesData.find((note) => note.id === n.note_id)
                      return note?.name
                    })
                    .filter(Boolean)
                    .join(', ')}
                </div>
              </div>
            )}
            {/* Middle Notes */}
            {selectedMiddleNotes.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">Middle Notes</div>
                <div className="h-8 bg-pink-500 rounded flex items-center justify-center text-white text-xs font-medium">
                  {selectedMiddleNotes
                    .map((n) => {
                      const note = notesData.find((note) => note.id === n.note_id)
                      return note?.name
                    })
                    .filter(Boolean)
                    .join(', ')}
                </div>
              </div>
            )}
            {/* Top Notes */}
            {selectedTopNotes.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">Top Notes</div>
                <div className="h-8 bg-blue-400 rounded flex items-center justify-center text-white text-xs font-medium">
                  {selectedTopNotes
                    .map((n) => {
                      const note = notesData.find((note) => note.id === n.note_id)
                      return note?.name
                    })
                    .filter(Boolean)
                    .join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

