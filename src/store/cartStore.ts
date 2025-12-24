import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId?: string
  customPerfumeId?: string
  quantity: number
  unitPrice: number
  product?: {
    id: string
    name: string
    brand?: string
    imageUrl?: string
  }
  customPerfume?: {
    id: string
    name?: string
    price: number
  }
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
  fetchCart: () => Promise<void>
  syncCart: () => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (item) => {
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: item.productId,
              customPerfumeId: item.customPerfumeId,
              quantity: item.quantity,
            }),
          })

          if (!response.ok) throw new Error('Failed to add item to cart')

          const { item: newItem } = await response.json()
          set((state) => ({
            items: [...state.items, newItem],
          }))
        } catch (error) {
          console.error('Error adding item to cart:', error)
          // Fallback: add to local state only
          const tempItem: CartItem = {
            id: `temp-${Date.now()}`,
            ...item,
          }
          set((state) => ({
            items: [...state.items, tempItem],
          }))
        }
      },

      updateItemQuantity: async (itemId: string, quantity: number) => {
        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
          })

          if (!response.ok) throw new Error('Failed to update item quantity')

          const { item: updatedItem } = await response.json()
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? updatedItem : item
            ),
          }))
        } catch (error) {
          console.error('Error updating item quantity:', error)
          // Fallback: update local state only
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          }))
        }
      },

      removeItem: async (itemId: string) => {
        try {
          const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE',
          })

          if (!response.ok) throw new Error('Failed to remove item')

          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }))
        } catch (error) {
          console.error('Error removing item:', error)
          // Fallback: remove from local state only
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          }))
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      fetchCart: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/cart')
          if (!response.ok) throw new Error('Failed to fetch cart')

          const { cart } = await response.json()
          set({
            items: cart.items || [],
            isLoading: false,
          })
        } catch (error) {
          console.error('Error fetching cart:', error)
          set({ isLoading: false })
        }
      },

      syncCart: async () => {
        // Sync local cart with server cart
        const { items } = get()
        if (items.length === 0) {
          await get().fetchCart()
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

