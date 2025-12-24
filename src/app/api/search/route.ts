import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchSchema.parse({ q: searchParams.get('q') || '' })

    if (!query.q || query.q.trim().length === 0) {
      return NextResponse.json({ products: [], inspirations: [] })
    }

    const searchTerm = query.q.toLowerCase().trim()

    // 1. Search RAWAJ products by name
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
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
          orderBy: {
            similarityScore: 'desc',
          },
        },
      },
      take: 10,
    })

    // 2. Search inspirations by displayName or aliases
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
          orderBy: {
            similarityScore: 'desc',
          },
        },
      },
    })

    // Filter inspirations that match search term
    const matchingInspirations = allInspirations.filter((insp) => {
      const displayNameMatch = insp.displayName.toLowerCase().includes(searchTerm)
      const aliases = (insp.searchableAliases as string[]) || []
      const aliasMatch = aliases.some((alias) =>
        alias.toLowerCase().includes(searchTerm)
      )
      return displayNameMatch || aliasMatch
    })

    // If inspiration match found, get associated RAWAJ products
    let matchedProducts: typeof products = []
    if (matchingInspirations.length > 0) {
      const inspirationIds = matchingInspirations.map((i) => i.id)
      const productInspirations = await prisma.productInspiration.findMany({
        where: {
          inspirationId: { in: inspirationIds },
          product: {
            isActive: true,
          },
        },
        include: {
          product: {
            include: {
              notes: {
                include: {
                  note: true,
                },
              },
            },
          },
          inspiration: true,
        },
        orderBy: {
          similarityScore: 'desc',
        },
        take: 10,
      })

      matchedProducts = productInspirations.map((pi) => pi.product)
    }

    // Combine direct product matches with inspiration-matched products
    const allMatchedProducts = [
      ...products,
      ...matchedProducts.filter(
        (p) => !products.some((existing) => existing.id === p.id)
      ),
    ]

    return NextResponse.json({
      products: allMatchedProducts,
      inspirations: matchingInspirations.map((i) => ({
        id: i.id,
        displayName: i.displayName,
        matchedProducts: i.products
          .filter((pi) => pi.product.isActive)
          .map((pi) => ({
            product: pi.product,
            similarityScore: pi.similarityScore,
          })),
      })),
      hasInspirationMatch: matchingInspirations.length > 0,
    })
  } catch (error) {
    console.error('Search error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

