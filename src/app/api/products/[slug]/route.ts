import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { slug },
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
    })

    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get similar products based on shared notes or inspirations
    const similarProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [
          {
            notes: {
              some: {
                noteId: {
                  in: product.notes.map((pn) => pn.noteId),
                },
              },
            },
          },
          {
            inspirations: {
              some: {
                inspirationId: {
                  in: product.inspirations.map((pi) => pi.inspirationId),
                },
              },
            },
          },
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
        },
      },
      take: 4,
    })

    return NextResponse.json({
      product,
      similarProducts,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

