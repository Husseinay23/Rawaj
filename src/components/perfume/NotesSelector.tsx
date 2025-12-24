'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePerfumeStore } from '@/store/perfumeStore'
import { notesData, type Note } from '@/data/notes'
import type { GenderProfile } from '@/types'

const noteCategories: { key: 'top' | 'middle' | 'base'; label: string; description: string }[] = [
  { key: 'top', label: 'Top Notes', description: 'First impression, light and fresh' },
  { key: 'middle', label: 'Middle Notes', description: 'Heart of the fragrance, balanced' },
  { key: 'base', label: 'Base Notes', description: 'Long-lasting foundation, deep and rich' },
]

export default function NotesSelector() {
  const {
    genderProfile,
    selectedTopNotes,
    selectedMiddleNotes,
    selectedBaseNotes,
    addNote,
    removeNote,
    updateNotePercentage,
  } = usePerfumeStore()

  const [activeCategory, setActiveCategory] = useState<'top' | 'middle' | 'base'>('top')
  const [availableNotes, setAvailableNotes] = useState<Note[]>(notesData)

  // Filter notes based on gender profile (simplified - in production, this would come from backend)
  useEffect(() => {
    if (genderProfile) {
      // For now, show all notes. In production, filter based on gender profile
      setAvailableNotes(notesData)
    }
  }, [genderProfile])

  const getSelectedNotes = (category: 'top' | 'middle' | 'base') => {
    if (category === 'top') return selectedTopNotes
    if (category === 'middle') return selectedMiddleNotes
    return selectedBaseNotes
  }

  const getNotesForCategory = (category: 'top' | 'middle' | 'base') => {
    return availableNotes.filter((note) => note.category === category)
  }

  const isNoteSelected = (noteId: string, category: 'top' | 'middle' | 'base') => {
    const selected = getSelectedNotes(category)
    return selected.some((n) => n.note_id === noteId)
  }

  const handleNoteClick = (note: Note) => {
    if (isNoteSelected(note.id, activeCategory)) {
      removeNote(note.id, activeCategory)
    } else {
      addNote(note, activeCategory, 20) // Default 20% per note
    }
  }

  const handlePercentageChange = (noteId: string, percentage: number) => {
    updateNotePercentage(noteId, activeCategory, Math.max(0, Math.min(100, percentage)))
  }

  const normalizePercentages = (category: 'top' | 'middle' | 'base') => {
    const selected = getSelectedNotes(category)
    if (selected.length === 0) return

    const total = selected.reduce((sum, n) => sum + n.percentage, 0)
    if (total !== 100) {
      const factor = 100 / total
      selected.forEach((n) => {
        updateNotePercentage(n.note_id, category, Math.round(n.percentage * factor))
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Choose Your Notes</h2>
        <p className="text-gray-600 text-sm">
          Select notes from each category to create your unique fragrance blend.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {noteCategories.map((category) => {
          const selected = getSelectedNotes(category.key)
          const isActive = activeCategory === category.key

          return (
            <button
              key={category.key}
              onClick={() => {
                setActiveCategory(category.key)
                normalizePercentages(category.key)
              }}
              className={`relative px-6 py-3 font-medium text-sm transition-colors ${
                isActive
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.label}
              {selected.length > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {selected.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active Category Description */}
      <div className="text-sm text-gray-600 mb-4">
        {noteCategories.find((c) => c.key === activeCategory)?.description}
      </div>

      {/* Notes Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {getNotesForCategory(activeCategory).map((note) => {
            const isSelected = isNoteSelected(note.id, activeCategory)
            const selectedNote = getSelectedNotes(activeCategory).find((n) => n.note_id === note.id)

            return (
              <motion.button
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">{note.name}</div>
                  {isSelected && selectedNote && (
                    <motion.div
                      className="mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedNote.percentage}
                          onChange={(e) => {
                            e.stopPropagation()
                            handlePercentageChange(note.id, parseInt(e.target.value))
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-medium text-purple-700 w-12">
                          {selectedNote.percentage}%
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
                {isSelected && (
                  <motion.div
                    className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <svg
                      className="w-3 h-3 text-white"
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
        </motion.div>
      </AnimatePresence>

      {/* Selected Notes Summary */}
      {(selectedTopNotes.length > 0 || selectedMiddleNotes.length > 0 || selectedBaseNotes.length > 0) && (
        <motion.div
          className="mt-6 p-4 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-semibold mb-2">Your Selection Summary</h3>
          <div className="space-y-2 text-sm">
            {selectedTopNotes.length > 0 && (
              <div>
                <span className="font-medium">Top Notes:</span>{' '}
                {selectedTopNotes
                  .map((n) => {
                    const note = notesData.find((note) => note.id === n.note_id)
                    return `${note?.name} (${n.percentage}%)`
                  })
                  .join(', ')}
              </div>
            )}
            {selectedMiddleNotes.length > 0 && (
              <div>
                <span className="font-medium">Middle Notes:</span>{' '}
                {selectedMiddleNotes
                  .map((n) => {
                    const note = notesData.find((note) => note.id === n.note_id)
                    return `${note?.name} (${n.percentage}%)`
                  })
                  .join(', ')}
              </div>
            )}
            {selectedBaseNotes.length > 0 && (
              <div>
                <span className="font-medium">Base Notes:</span>{' '}
                {selectedBaseNotes
                  .map((n) => {
                    const note = notesData.find((note) => note.id === n.note_id)
                    return `${note?.name} (${n.percentage}%)`
                  })
                  .join(', ')}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

