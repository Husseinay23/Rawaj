import { create } from 'zustand'
import type {
  BottleSize,
  Perfume,
  GenderProfile,
  Note,
  NoteSelection,
  PerfumeCreationStep,
} from '@/types'

interface PerfumeState {
  // Step 1: Bottle Size
  selectedBottleSize: BottleSize | null
  
  // Step 2: Gender Profile
  genderProfile: GenderProfile | null
  
  // Step 3: Notes Selection
  selectedTopNotes: NoteSelection[]
  selectedMiddleNotes: NoteSelection[]
  selectedBaseNotes: NoteSelection[]
  
  // Step 4: Inspiration/Recommendation
  selectedPerfume: Perfume | null
  
  // Step 5: Naming
  customPerfumeName: string
  
  // Step 6: Price & Summary
  estimatedPrice: number | null
  
  // Current step
  currentStep: PerfumeCreationStep
  
  // Actions
  setBottleSize: (size: BottleSize) => void
  setGenderProfile: (profile: GenderProfile) => void
  addNote: (note: Note, category: 'top' | 'middle' | 'base', percentage?: number) => void
  removeNote: (noteId: string, category: 'top' | 'middle' | 'base') => void
  updateNotePercentage: (noteId: string, category: 'top' | 'middle' | 'base', percentage: number) => void
  setSelectedPerfume: (perfume: Perfume | null) => void
  setCustomPerfumeName: (name: string) => void
  setCurrentStep: (step: PerfumeCreationStep) => void
  calculatePrice: () => void
  reset: () => void
  canProceedToNextStep: () => boolean
}

export const usePerfumeStore = create<PerfumeState>((set, get) => ({
  selectedBottleSize: null,
  genderProfile: null,
  selectedTopNotes: [],
  selectedMiddleNotes: [],
  selectedBaseNotes: [],
  selectedPerfume: null,
  customPerfumeName: '',
  estimatedPrice: null,
  currentStep: 1,
  
  setBottleSize: (size) => {
    set({ selectedBottleSize: size })
    get().calculatePrice()
  },
  
  setGenderProfile: (profile) => {
    set({ genderProfile: profile })
  },
  
  addNote: (note, category, percentage = 20) => {
    const state = get()
    const noteSelection: NoteSelection = {
      note_id: note.id,
      percentage,
    }
    
    if (category === 'top') {
      const exists = state.selectedTopNotes.find(n => n.note_id === note.id)
      if (!exists) {
        set({ selectedTopNotes: [...state.selectedTopNotes, noteSelection] })
      }
    } else if (category === 'middle') {
      const exists = state.selectedMiddleNotes.find(n => n.note_id === note.id)
      if (!exists) {
        set({ selectedMiddleNotes: [...state.selectedMiddleNotes, noteSelection] })
      }
    } else if (category === 'base') {
      const exists = state.selectedBaseNotes.find(n => n.note_id === note.id)
      if (!exists) {
        set({ selectedBaseNotes: [...state.selectedBaseNotes, noteSelection] })
      }
    }
  },
  
  removeNote: (noteId, category) => {
    const state = get()
    if (category === 'top') {
      set({ selectedTopNotes: state.selectedTopNotes.filter(n => n.note_id !== noteId) })
    } else if (category === 'middle') {
      set({ selectedMiddleNotes: state.selectedMiddleNotes.filter(n => n.note_id !== noteId) })
    } else if (category === 'base') {
      set({ selectedBaseNotes: state.selectedBaseNotes.filter(n => n.note_id !== noteId) })
    }
  },
  
  updateNotePercentage: (noteId, category, percentage) => {
    const state = get()
    if (category === 'top') {
      set({
        selectedTopNotes: state.selectedTopNotes.map(n =>
          n.note_id === noteId ? { ...n, percentage } : n
        ),
      })
    } else if (category === 'middle') {
      set({
        selectedMiddleNotes: state.selectedMiddleNotes.map(n =>
          n.note_id === noteId ? { ...n, percentage } : n
        ),
      })
    } else if (category === 'base') {
      set({
        selectedBaseNotes: state.selectedBaseNotes.map(n =>
          n.note_id === noteId ? { ...n, percentage } : n
        ),
      })
    }
  },
  
  setSelectedPerfume: (perfume) => {
    set({ selectedPerfume: perfume })
  },
  
  setCustomPerfumeName: (name) => {
    set({ customPerfumeName: name })
  },
  
  setCurrentStep: (step) => {
    set({ currentStep: step })
  },
  
  calculatePrice: () => {
    const { selectedBottleSize } = get()
    const basePrice = selectedBottleSize ? selectedBottleSize.price : 0
    // Add any additional pricing logic here (e.g., based on notes count)
    set({ estimatedPrice: basePrice })
  },
  
  canProceedToNextStep: () => {
    const state = get()
    switch (state.currentStep) {
      case 1:
        return state.selectedBottleSize !== null
      case 2:
        return state.genderProfile !== null
      case 3:
        return (
          state.selectedTopNotes.length > 0 ||
          state.selectedMiddleNotes.length > 0 ||
          state.selectedBaseNotes.length > 0
        )
      case 4:
        return true // Optional step
      case 5:
        return state.customPerfumeName.trim().length > 0
      case 6:
        return false // Final step
      default:
        return false
    }
  },
  
  reset: () =>
    set({
      selectedBottleSize: null,
      genderProfile: null,
      selectedTopNotes: [],
      selectedMiddleNotes: [],
      selectedBaseNotes: [],
      selectedPerfume: null,
      customPerfumeName: '',
      estimatedPrice: null,
      currentStep: 1,
    }),
}))

// Export types for backward compatibility
export type { BottleSize, Perfume }

