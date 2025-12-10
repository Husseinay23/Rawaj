import { create } from 'zustand'

export interface Perfume {
  id: string
  name: string
  brand: string
  description: string | null
  image: string | null
  inspiration_of: string | null
}

export interface BottleSize {
  id: string
  size: string
  price: number
}

interface PerfumeState {
  selectedBottleSize: BottleSize | null
  selectedPerfume: Perfume | null
  estimatedPrice: number | null
  setBottleSize: (size: BottleSize) => void
  setSelectedPerfume: (perfume: Perfume) => void
  calculatePrice: () => void
  reset: () => void
}

export const usePerfumeStore = create<PerfumeState>((set, get) => ({
  selectedBottleSize: null,
  selectedPerfume: null,
  estimatedPrice: null,
  setBottleSize: (size) => {
    set({ selectedBottleSize: size })
    get().calculatePrice()
  },
  setSelectedPerfume: (perfume) => {
    set({ selectedPerfume: perfume })
    get().calculatePrice()
  },
  calculatePrice: () => {
    const { selectedBottleSize } = get()
    const price = selectedBottleSize ? selectedBottleSize.price : null
    set({ estimatedPrice: price })
  },
  reset: () =>
    set({
      selectedBottleSize: null,
      selectedPerfume: null,
      estimatedPrice: null,
    }),
}))

