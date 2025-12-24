import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productQuerySchema = z.object({
  isActive: z.string().optional(),
  brand: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = productQuerySchema.parse({
      isActive: searchParams.get('isActive'),
      brand: searchParams.get('brand'),
    })

    const products = await prisma.product.findMany({
      where: {
        isActive: query.isActive !== null ? query.isActive === 'true' : true,
        ...(query.brand && { brand: query.brand }),
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
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error('Error fetching products:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

