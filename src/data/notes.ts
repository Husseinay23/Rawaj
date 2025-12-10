export interface Note {
  id: string
  name: string
  category: 'top' | 'middle' | 'base'
}

export const notesData: Note[] = [
  // Top Notes
  { id: '1', name: 'Bergamot', category: 'top' },
  { id: '2', name: 'Lemon', category: 'top' },
  { id: '3', name: 'Orange', category: 'top' },
  { id: '4', name: 'Lavender', category: 'top' },
  { id: '5', name: 'Pink Pepper', category: 'top' },

  // Middle Notes
  { id: '6', name: 'Rose', category: 'middle' },
  { id: '7', name: 'Jasmine', category: 'middle' },
  { id: '8', name: 'Lily', category: 'middle' },
  { id: '9', name: 'Cinnamon', category: 'middle' },
  { id: '10', name: 'Cardamom', category: 'middle' },

  // Base Notes
  { id: '11', name: 'Vanilla', category: 'base' },
  { id: '12', name: 'Oud', category: 'base' },
  { id: '13', name: 'Musk', category: 'base' },
  { id: '14', name: 'Amber', category: 'base' },
  { id: '15', name: 'Sandalwood', category: 'base' },
]

