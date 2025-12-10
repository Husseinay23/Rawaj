import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { notes } = await request.json()

    if (!Array.isArray(notes) || notes.length === 0) {
      return NextResponse.json(
        { error: 'Notes array is required' },
        { status: 400 }
      )
    }

    // First, get note IDs from note names (case-insensitive)
    const { data: noteRecords, error: noteError } = await supabase
      .from('notes')
      .select('id, name')
      .in('name', notes.map((n: string) => n.toLowerCase()))

    if (noteError) {
      throw noteError
    }

    if (!noteRecords || noteRecords.length === 0) {
      return NextResponse.json({ perfumes: [] })
    }

    const noteIds = noteRecords.map((n) => n.id)

    // Query perfumes that match the selected notes
    const { data: perfumeNotes, error: notesError } = await supabase
      .from('perfume_notes')
      .select('perfume_id, note_id, strength')
      .in('note_id', noteIds)

    if (notesError) {
      throw notesError
    }

    // Count matches per perfume (weighted by strength)
    const perfumeMatches: Record<string, number> = {}
    perfumeNotes?.forEach((pn) => {
      const strength = pn.strength || 1
      perfumeMatches[pn.perfume_id] =
        (perfumeMatches[pn.perfume_id] || 0) + strength
    })

    // Get perfume details
    const perfumeIds = Object.keys(perfumeMatches)
    
    if (perfumeIds.length === 0) {
      return NextResponse.json({ perfumes: [] })
    }

    const { data: perfumes, error: perfumesError } = await supabase
      .from('perfumes')
      .select('*')
      .in('id', perfumeIds)

    if (perfumesError) {
      throw perfumesError
    }

    // Add match scores and sort
    const perfumesWithScores = perfumes?.map((perfume) => ({
      ...perfume,
      matchScore: perfumeMatches[perfume.id] || 0,
    }))

    perfumesWithScores?.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({ perfumes: perfumesWithScores || [] })
  } catch (error) {
    console.error('Error fetching perfumes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch perfumes' },
      { status: 500 }
    )
  }
}

