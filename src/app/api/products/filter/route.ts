import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GenderProfile, NoteCategory } from '@prisma/client'
import { z } from 'zod'

const filterSchema = z.object({
  gender: z.enum(['MASCULINE', 'FEMININE', 'MIXED']).optional(),
  noteCategory: z.enum(['TOP', 'MIDDLE', 'BASE']).optional(),
  noteId: z.string().optional(),
  mood: z.string().optional(),
  intensity: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  search: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = filterSchema.parse({
      gender: searchParams.get('gender'),
      noteCategory: searchParams.get('noteCategory'),
      noteId: searchParams.get('noteId'),
      mood: searchParams.get('mood'),
      intensity: searchParams.get('intensity'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      search: searchParams.get('search'),
    })

    // Build where clause
    const where: any = {
      isActive: true,
    }

    // Search by name/description
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
      where.price = {}
      if (filters.minPrice) {
        where.price.gte = parseFloat(filters.minPrice)
      }
      if (filters.maxPrice) {
        where.price.lte = parseFloat(filters.maxPrice)
      }
    }

    // Filter by note
    if (filters.noteId) {
      where.notes = {
        some: {
          noteId: filters.noteId,
          ...(filters.noteCategory && {
            note: {
              category: filters.noteCategory as NoteCategory,
            },
          }),
        },
      }
    }

    // Filter by inspiration gender (if product has inspirations)
    if (filters.gender) {
      where.inspirations = {
        some: {
          inspiration: {
            genderProfile: filters.gender as GenderProfile,
          },
        },
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        notes: {
          include: {
            note: true,
          },
        },
        inspirations: {
          include: {
            inspiration: true,
          },
          orderBy: {
            similarityScore: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Filter by mood/intensity if needed (requires checking inspirations)
    let filteredProducts = products
    if (filters.mood || filters.intensity) {
      filteredProducts = products.filter((product) => {
        const hasMatchingInspiration = product.inspirations.some((pi) => {
          const insp = pi.inspiration
          const moods = (insp.moodTags as string[]) || []
          const matchesMood =
            !filters.mood || moods.some((m) => m.toLowerCase() === filters.mood?.toLowerCase())
          const matchesIntensity =
            !filters.intensity || insp.intensity === parseInt(filters.intensity)
          return matchesMood && matchesIntensity
        })
        return hasMatchingInspiration
      })
    }

    return NextResponse.json({ products: filteredProducts })
  } catch (error) {
    console.error('Filter error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Filter failed' }, { status: 500 })
  }
}

