import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const recommendationsSchema = z.object({
  notes: z.array(z.string()).min(1),
  genderProfile: z.enum(['MASCULINE', 'FEMININE', 'MIXED']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notes, genderProfile } = recommendationsSchema.parse(body)

    if (!Array.isArray(notes) || notes.length === 0) {
      return NextResponse.json({ error: 'Notes array is required' }, { status: 400 })
    }

    // Find notes by name (case-insensitive)
    const noteRecords = await prisma.note.findMany({
      where: {
        name: {
          in: notes.map((n) => n.toLowerCase()),
          mode: 'insensitive',
        },
      },
    })

    if (noteRecords.length === 0) {
      return NextResponse.json({ perfumes: [] })
    }

    const noteIds = noteRecords.map((n) => n.id)

    // Find products that have these notes
    const productNotes = await prisma.productNote.findMany({
      where: {
        noteId: {
          in: noteIds,
        },
      },
      include: {
        product: {
          where: {
            isActive: true,
          },
        },
      },
    })

    // Also check inspirations that match these notes
    const allInspirations = await prisma.inspiration.findMany({
      include: {
        products: {
          include: {
            product: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    })

    // Find inspirations that match the selected notes
    const matchingInspirations = allInspirations.filter((insp) => {
      const inspTopNotes = (insp.topNotes as string[]) || []
      const inspMiddleNotes = (insp.middleNotes as string[]) || []
      const inspBaseNotes = (insp.baseNotes as string[]) || []
      const allInspNotes = [...inspTopNotes, ...inspMiddleNotes, ...inspBaseNotes]

      return notes.some((note) =>
        allInspNotes.some((inspNote) =>
          inspNote.toLowerCase().includes(note.toLowerCase())
        )
      )
    })

    // Get products from matching inspirations
    const inspirationProductIds = new Set<string>()
    matchingInspirations.forEach((insp) => {
      insp.products.forEach((pi) => {
        if (pi.product) {
          inspirationProductIds.add(pi.product.id)
        }
      })
    })

    // Count matches per product (weighted by strength)
    const productMatches: Record<string, number> = {}
    productNotes.forEach((pn) => {
      if (pn.product) {
        const strength = pn.strength || 1
        productMatches[pn.productId] = (productMatches[pn.productId] || 0) + strength
      }
    })

    // Boost score for products that match inspirations
    inspirationProductIds.forEach((productId) => {
      productMatches[productId] = (productMatches[productId] || 0) + 5 // Boost inspiration matches
    })

    const productIds = Object.keys(productMatches)

    if (productIds.length === 0) {
      return NextResponse.json({ perfumes: [] })
    }

    // Get product details
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        isActive: true,
      },
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
        },
      },
    })

    // Add match scores and sort
    const perfumesWithScores = products.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand || 'Rawaj',
      description: product.description,
      image: product.imageUrl,
      inspiration_of: null,
      matchScore: productMatches[product.id] || 0,
    }))

    perfumesWithScores.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({ perfumes: perfumesWithScores })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}

