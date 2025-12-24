import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bottleSizes = await prisma.bottleSize.findMany({
      orderBy: {
        sizeMl: 'asc',
      },
    })

    // Transform to match frontend expectations
    const sizes = bottleSizes.map((size) => ({
      id: size.id,
      size: `${size.sizeMl}ml`,
      price: Number(size.basePrice),
    }))

    return NextResponse.json({ sizes })
  } catch (error) {
    console.error('Error fetching bottle sizes:', error)
    return NextResponse.json({ error: 'Failed to fetch bottle sizes' }, { status: 500 })
  }
}

