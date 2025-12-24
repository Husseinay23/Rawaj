'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
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
      category: 'TOP' | 'MIDDLE' | 'BASE'
    }
    strength: number
  }>
  inspirations: Array<{
    inspiration: {
      id: string
      displayName: string
      mainAccords: string[]
      moodTags: string[]
    }
    similarityScore: number
  }>
}

interface SimilarProduct {
  id: string
  name: string
  slug: string
  price: number
  imageUrl?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { theme } = useTheme()
  const { addItem } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml' | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug])

  const fetchProduct = async () => {
    if (!params.slug || typeof params.slug !== 'string') {
      setError('Invalid product')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/products/${params.slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found')
        } else {
          setError('Failed to load product')
        }
        return
      }
      const data = await response.json()
      if (!data.product) {
        setError('Product not found')
        return
      }
      setProduct(data.product)
      setSimilarProducts(Array.isArray(data.similarProducts) ? data.similarProducts : [])
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product || !selectedSize) {
      alert('Please select a size')
      return
    }

    setAddingToCart(true)
    try {
      // Calculate price based on size
      const basePrice = Number(product.price)
      const sizeMultiplier = selectedSize === '100ml' ? 1.8 : 1.0 // 100ml is ~1.8x the price
      const finalPrice = basePrice * sizeMultiplier

      await addItem({
        productId: product.id,
        quantity: 1,
        unitPrice: finalPrice,
      })

      alert('Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const bgColor = theme === 'light' ? 'bg-[#F6EDE6]' : 'bg-[#0F172A]'
  const textColor = theme === 'light' ? 'text-[#1A1A1A]' : 'text-[#F8F8F8]'
  const textSecondary = theme === 'light' ? 'text-[#4A4A4A]' : 'text-[#D1D5DB]'
  const surfaceColor = theme === 'light' ? 'bg-white' : 'bg-[#1E293B]'
  const borderColor = theme === 'light' ? 'border-[#E5E5E5]' : 'border-[#334155]'
  const accentColor = 'bg-[#8B7355]'
  const accentText = 'text-[#8B7355]'

  if (loading) {
    return (
      <main className={`min-h-screen ${bgColor} pt-20`}>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${accentText} border-t-transparent`}></div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className={`min-h-screen ${bgColor} pt-20`}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <p className={`${textColor} text-lg mb-4`}>{error || 'Product not found'}</p>
            <Link
              href="/shop"
              className={`inline-block px-6 py-2 ${accentColor} text-white rounded-lg hover:opacity-90`}
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const topNotes = product.notes.filter((n) => n.note.category === 'TOP')
  const middleNotes = product.notes.filter((n) => n.note.category === 'MIDDLE')
  const baseNotes = product.notes.filter((n) => n.note.category === 'BASE')

  const basePrice = Number(product.price)
  const price50ml = basePrice
  const price100ml = basePrice * 1.8

  return (
    <main className={`min-h-screen ${bgColor} pt-20`}>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Breadcrumb */}
        <nav className={`mb-8 text-sm ${textSecondary}`}>
          <Link href="/shop" className={`hover:${accentText} transition-colors`}>
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className={textColor}>{product.name || 'Product'}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative">
            <div className={`relative aspect-[3/4] ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} rounded-2xl overflow-hidden`}>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className={`flex items-center justify-center h-full ${textSecondary}`}>
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${textColor}`}>
              {product.name || 'Unnamed Product'}
            </h1>
            {product.brand && (
              <p className={`text-lg ${textSecondary} mb-6`}>{product.brand}</p>
            )}

            <p className={`${textColor} mb-8 leading-relaxed`}>
              {product.description || 'No description available'}
            </p>

            {/* Scent Pyramid */}
            {product.notes && product.notes.length > 0 && (
              <div className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Scent Pyramid</h2>
                <div className="space-y-3">
                  {/* Base Notes */}
                  {baseNotes.length > 0 && (
                    <div>
                      <div className={`text-xs font-medium ${textSecondary} mb-1`}>Base Notes</div>
                      <div className={`h-10 ${theme === 'light' ? 'bg-amber-900' : 'bg-amber-700'} rounded flex items-center justify-center text-white text-sm font-medium px-4`}>
                        {baseNotes.map((n) => n.note?.name || 'Note').join(', ')}
                      </div>
                    </div>
                  )}
                  {/* Middle Notes */}
                  {middleNotes.length > 0 && (
                    <div>
                      <div className={`text-xs font-medium ${textSecondary} mb-1`}>Middle Notes</div>
                      <div className={`h-10 ${theme === 'light' ? 'bg-amber-800' : 'bg-amber-600'} rounded flex items-center justify-center text-white text-sm font-medium px-4`}>
                        {middleNotes.map((n) => n.note?.name || 'Note').join(', ')}
                      </div>
                    </div>
                  )}
                  {/* Top Notes */}
                  {topNotes.length > 0 && (
                    <div>
                      <div className={`text-xs font-medium ${textSecondary} mb-1`}>Top Notes</div>
                      <div className={`h-10 ${theme === 'light' ? 'bg-amber-700' : 'bg-amber-500'} rounded flex items-center justify-center text-white text-sm font-medium px-4`}>
                        {topNotes.map((n) => n.note?.name || 'Note').join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Select Size</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedSize('50ml')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSize === '50ml'
                      ? `${borderColor} ${accentColor} text-white`
                      : `${borderColor} ${surfaceColor} ${textColor} hover:opacity-80`
                  }`}
                >
                  <div className="font-semibold mb-1">50ml</div>
                  <div className={`text-lg ${selectedSize === '50ml' ? 'text-white' : accentText}`}>
                    ${price50ml.toFixed(2)}
                  </div>
                </button>
                <button
                  onClick={() => setSelectedSize('100ml')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSize === '100ml'
                      ? `${borderColor} ${accentColor} text-white`
                      : `${borderColor} ${surfaceColor} ${textColor} hover:opacity-80`
                  }`}
                >
                  <div className="font-semibold mb-1">100ml</div>
                  <div className={`text-lg ${selectedSize === '100ml' ? 'text-white' : accentText}`}>
                    ${price100ml.toFixed(2)}
                  </div>
                </button>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="mb-8">
              <div className={`text-3xl font-bold ${accentText} mb-6`}>
                {selectedSize === '100ml' ? `$${price100ml.toFixed(2)}` : `$${price50ml.toFixed(2)}`}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || addingToCart}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-opacity ${
                  selectedSize && !addingToCart
                    ? `${accentColor} text-white hover:opacity-90`
                    : `${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'} ${textSecondary} cursor-not-allowed`
                }`}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>

            {/* Inspiration Info (subtle, no brand names) */}
            {product.inspirations && product.inspirations.length > 0 && (
              <div className={`mt-8 p-4 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'} rounded-lg`}>
                <p className={`text-sm ${textSecondary} italic`}>
                  This fragrance captures a style reminiscent of classic luxury perfumery.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-3xl font-bold mb-8 ${textColor}`}>You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similar) => (
                <Link key={similar.id} href={`/shop/${similar.slug || similar.id}`}>
                  <div className={`${surfaceColor} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}>
                    <div className={`relative h-48 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                      {similar.imageUrl ? (
                        <Image
                          src={similar.imageUrl}
                          alt={similar.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className={`flex items-center justify-center h-full ${textSecondary}`}>
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className={`font-semibold mb-2 ${textColor}`}>{similar.name || 'Product'}</h3>
                      <p className={`${accentText} font-bold`}>
                        ${similar.price ? Number(similar.price).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

