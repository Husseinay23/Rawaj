'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePerfumeStore, type Perfume } from '@/store/perfumeStore'
import { supabase } from '@/lib/supabaseClient'

export default function InspirationSelector() {
  const { selectedPerfume, setSelectedPerfume } = usePerfumeStore()
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPerfumes = async () => {
      try {
        const { data, error } = await supabase
          .from('perfumes')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        
        // Fallback data if database is empty
        if (!data || data.length === 0) {
          console.warn('No perfumes found in database, using fallback data')
          const fallback = [
            { id: '1', name: 'Classic Elegance', brand: 'Rawaj', description: 'A timeless fragrance', image: null, inspiration_of: null },
            { id: '2', name: 'Modern Fresh', brand: 'Rawaj', description: 'A contemporary blend', image: null, inspiration_of: null },
            { id: '3', name: 'Oriental Spice', brand: 'Rawaj', description: 'Rich and warm', image: null, inspiration_of: null },
          ]
          setPerfumes(fallback)
          setFilteredPerfumes(fallback)
        } else {
          setPerfumes(data)
          setFilteredPerfumes(data)
        }
      } catch (error) {
        console.error('Error fetching perfumes:', error)
        // Fallback data on error
        const fallback = [
          { id: '1', name: 'Classic Elegance', brand: 'Rawaj', description: 'A timeless fragrance', image: null, inspiration_of: null },
          { id: '2', name: 'Modern Fresh', brand: 'Rawaj', description: 'A contemporary blend', image: null, inspiration_of: null },
        ]
        setPerfumes(fallback)
        setFilteredPerfumes(fallback)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfumes()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPerfumes(perfumes)
    } else {
      const filtered = perfumes.filter(
        (perfume) =>
          perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          perfume.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPerfumes(filtered)
    }
  }, [searchQuery, perfumes])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPerfume = (perfume: Perfume) => {
    setSelectedPerfume(perfume)
    setIsOpen(false)
    setSearchQuery('')
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="text-sm text-gray-500">Loading perfumes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">
        Choose Your Inspiration
      </h2>
      <div className="relative max-w-2xl" ref={dropdownRef}>
        {/* Selected Perfume Display */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 rounded-lg border-2 border-gray-200 bg-white text-left flex items-center justify-between hover:border-gray-300 transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div>
            {selectedPerfume ? (
              <div>
                <div className="font-semibold">{selectedPerfume.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedPerfume.brand}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Select an inspiration perfume</span>
            )}
          </div>
          <motion.svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M19 9l-7 7-7-7"></path>
          </motion.svg>
        </motion.button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search perfumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Perfume List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredPerfumes.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No perfumes found
                  </div>
                ) : (
                  filteredPerfumes.map((perfume) => (
                    <motion.button
                      key={perfume.id}
                      onClick={() => handleSelectPerfume(perfume)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedPerfume?.id === perfume.id
                          ? 'bg-purple-50 border-l-4 border-purple-500'
                          : ''
                      }`}
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="font-semibold">{perfume.name}</div>
                      <div className="text-sm text-gray-600">{perfume.brand}</div>
                      {perfume.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-full">
                          {perfume.description}
                        </div>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

