import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { z } from 'zod'
import { GenderProfile } from '@prisma/client'

const customPerfumeSchema = z.object({
  name: z.string().optional(),
  bottleSizeId: z.string(),
  genderProfile: z.enum(['MASCULINE', 'FEMININE', 'MIXED']),
  topNotes: z.array(z.object({ noteId: z.string(), percentage: z.number() })),
  middleNotes: z.array(z.object({ noteId: z.string(), percentage: z.number() })),
  baseNotes: z.array(z.object({ noteId: z.string(), percentage: z.number() })),
  inspirationProductId: z.string().optional(),
})

// Server-side price calculation
async function calculateCustomPerfumePrice(bottleSizeId: string): Promise<number> {
  const bottleSize = await prisma.bottleSize.findUnique({
    where: { id: bottleSizeId },
  })

  if (!bottleSize) {
    throw new Error('Bottle size not found')
  }

  const basePrice = Number(bottleSize.basePrice)
  // Add any additional pricing logic here (e.g., based on number of notes)
  return basePrice
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const data = customPerfumeSchema.parse(body)

    // Calculate price server-side
    const price = await calculateCustomPerfumePrice(data.bottleSizeId)

    const customPerfume = await prisma.customPerfume.create({
      data: {
        userId: session?.user?.id,
        name: data.name,
        bottleSizeId: data.bottleSizeId,
        genderProfile: data.genderProfile as GenderProfile,
        topNotes: data.topNotes,
        middleNotes: data.middleNotes,
        baseNotes: data.baseNotes,
        inspirationProductId: data.inspirationProductId,
        price,
      },
    })

    return NextResponse.json({ customPerfume }, { status: 201 })
  } catch (error) {
    console.error('Error creating custom perfume:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create custom perfume' }, { status: 500 })
  }
}

