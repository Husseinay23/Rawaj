export interface PerfumePreset {
  id: string
  name: string
  brand: string
  description: string
  image?: string
  inspiration_of?: string
}

export const perfumePresets: PerfumePreset[] = [
  {
    id: '1',
    name: 'Classic Elegance',
    brand: 'Rawaj',
    description: 'A timeless fragrance with floral and woody notes',
    inspiration_of: 'Traditional luxury',
  },
  {
    id: '2',
    name: 'Modern Fresh',
    brand: 'Rawaj',
    description: 'A contemporary blend of citrus and aquatic notes',
    inspiration_of: 'Modern minimalism',
  },
  {
    id: '3',
    name: 'Oriental Spice',
    brand: 'Rawaj',
    description: 'Rich and warm with oud and vanilla',
    inspiration_of: 'Eastern traditions',
  },
]

