'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

interface Product {
  id: string
  name: string
  slug: string
  brand?: string
  description: string
  price: number
  imageUrl?: string
  notes: Array<{
    note: {
      id: string
      name: string
      category: string
    }
    strength: number
  }>
}

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState({
    gender: searchParams.get('gender') || '',
    noteCategory: searchParams.get('noteCategory') || '',
    mood: searchParams.get('mood') || '',
  })
  const [hasInspirationMatch, setHasInspirationMatch] = useState(false)

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      let response: Response
      let data: any

      // If there's a search query, use search endpoint
      if (searchQuery.trim()) {
        response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        if (!response.ok) {
          throw new Error('Search failed')
        }
        data = await response.json()
        setProducts(Array.isArray(data.products) ? data.products : [])
        setHasInspirationMatch(data.hasInspirationMatch || false)
      } else {
        // Otherwise use filter endpoint or default products
        const params = new URLSearchParams()
        if (filters.gender) params.append('gender', filters.gender)
        if (filters.noteCategory) params.append('noteCategory', filters.noteCategory)
        if (filters.mood) params.append('mood', filters.mood)

        const url = params.toString() 
          ? `/api/products/filter?${params.toString()}`
          : '/api/products'
        
        response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        data = await response.json()
        setProducts(Array.isArray(data.products) ? data.products : [])
        setHasInspirationMatch(false)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products. Please try again.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    router.push(`/shop?${params.toString()}`)
    fetchProducts()
  }

  const bgColor = theme === 'light' ? 'bg-[#F6EDE6]' : 'bg-[#0F172A]'
  const textColor = theme === 'light' ? 'text-[#1A1A1A]' : 'text-[#F8F8F8]'
  const textSecondary = theme === 'light' ? 'text-[#4A4A4A]' : 'text-[#D1D5DB]'
  const surfaceColor = theme === 'light' ? 'bg-white' : 'bg-[#1E293B]'
  const borderColor = theme === 'light' ? 'border-[#E5E5E5]' : 'border-[#334155]'
  const accentColor = 'bg-[#8B7355]'
  const accentText = 'text-[#8B7355]'

  return (
    <main className={`min-h-screen ${bgColor} pt-20`}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${textColor}`}>
            Our Collection
          </h1>
          <p className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
            Discover our curated selection of luxury fragrances, each crafted with precision and passion.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or find similar scents..."
              className={`flex-1 px-6 py-4 text-lg border-2 ${borderColor} ${surfaceColor} ${textColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]`}
            />
            <button
              type="submit"
              className={`px-8 py-4 ${accentColor} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
            >
              Search
            </button>
          </div>
          {hasInspirationMatch && (
            <p className={`text-center mt-4 text-sm ${textSecondary} italic`}>
              Showing fragrances inspired by the style you're looking for
            </p>
          )}
        </form>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <select
            value={filters.gender}
            onChange={(e) => {
              setFilters({ ...filters, gender: e.target.value })
              setSearchQuery('')
            }}
            className={`px-4 py-2 border ${borderColor} ${surfaceColor} ${textColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]`}
          >
            <option value="">All Genders</option>
            <option value="MASCULINE">Masculine</option>
            <option value="FEMININE">Feminine</option>
            <option value="MIXED">Mixed</option>
          </select>

          <select
            value={filters.noteCategory}
            onChange={(e) => {
              setFilters({ ...filters, noteCategory: e.target.value })
              setSearchQuery('')
            }}
            className={`px-4 py-2 border ${borderColor} ${surfaceColor} ${textColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]`}
          >
            <option value="">All Notes</option>
            <option value="TOP">Top Notes</option>
            <option value="MIDDLE">Middle Notes</option>
            <option value="BASE">Base Notes</option>
          </select>

          <select
            value={filters.mood}
            onChange={(e) => {
              setFilters({ ...filters, mood: e.target.value })
              setSearchQuery('')
            }}
            className={`px-4 py-2 border ${borderColor} ${surfaceColor} ${textColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]`}
          >
            <option value="">All Moods</option>
            <option value="confident">Confident</option>
            <option value="elegant">Elegant</option>
            <option value="bold">Bold</option>
            <option value="sophisticated">Sophisticated</option>
            <option value="sensual">Sensual</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${accentText} border-t-transparent`}></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className={`${textColor} text-lg mb-4`}>{error}</p>
            <button
              onClick={fetchProducts}
              className={`px-6 py-2 ${accentColor} text-white rounded-lg hover:opacity-90`}
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className={`${textSecondary} text-lg`}>No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/shop/${product.slug || product.id}`}>
                <div className={`${surfaceColor} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}>
                  {/* Product Image */}
                  <div className={`relative h-64 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className={`flex items-center justify-center h-full ${textSecondary}`}>
                          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className={`text-xl font-bold mb-2 ${textColor}`}>
                        {product.name || 'Unnamed Product'}
                      </h3>
                      {product.brand && (
                        <p className={`text-sm ${textSecondary} mb-2`}>{product.brand}</p>
                      )}
                      <p className={`${textSecondary} text-sm mb-4 line-clamp-2`}>
                        {product.description || 'No description available'}
                      </p>

                      {/* Notes Preview */}
                      {product.notes && product.notes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.notes.slice(0, 3).map((pn) => (
                            <span
                              key={pn.note?.id || Math.random()}
                              className={`px-2 py-1 text-xs ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} ${textColor} rounded-full`}
                            >
                              {pn.note?.name || 'Note'}
                            </span>
                          ))}
                          {product.notes.length > 3 && (
                            <span className={`px-2 py-1 text-xs ${textSecondary}`}>+{product.notes.length - 3}</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold ${accentText}`}>
                          ${product.price ? Number(product.price).toFixed(2) : '0.00'}
                        </span>
                        <span className={`text-sm ${textSecondary}`}>
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

