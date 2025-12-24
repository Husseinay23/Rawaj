import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NoteCategory } from '@prisma/client'
import { z } from 'zod'

const notesQuerySchema = z.object({
  category: z.enum(['TOP', 'MIDDLE', 'BASE']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = notesQuerySchema.parse({
      category: searchParams.get('category') as 'TOP' | 'MIDDLE' | 'BASE' | null,
    })

    const notes = await prisma.note.findMany({
      where: {
        ...(query.category && { category: query.category as NoteCategory }),
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Error fetching notes:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

