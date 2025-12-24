// Type definitions for RAWAJ

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
}

export interface Product {
  id: string
  name: string
  brand: string
  description: string
  price: number
  image_url?: string
  stock_quantity: number
  is_active: boolean
  notes?: Note[]
}

export interface Note {
  id: string
  name: string
  category: 'top' | 'middle' | 'base'
  description?: string
  image_url?: string
}

export interface NoteSelection {
  note_id: string
  percentage: number // 0-100
}

export interface CustomPerfume {
  id?: string
  name?: string
  bottle_size_id: string
  gender_profile: 'masculine' | 'feminine' | 'mixed'
  top_notes: NoteSelection[]
  middle_notes: NoteSelection[]
  base_notes: NoteSelection[]
  inspiration_product_id?: string
  price: number
}

export interface CartItem {
  id: string
  product_id?: string
  custom_perfume_id?: string
  quantity: number
  price: number
  product?: Product
  custom_perfume?: CustomPerfume
}

export interface Order {
  id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping: number
  tax: number
  total: number
  shipping_address: Address
  billing_address: Address
  items: OrderItem[]
  created_at: string
}

export interface OrderItem {
  id: string
  product_id?: string
  custom_perfume_id?: string
  quantity: number
  price: number
}

export interface Address {
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
}

export interface BottleSize {
  id: string
  size: string
  price: number
}

export interface Perfume {
  id: string
  name: string
  brand: string
  description: string | null
  image: string | null
  inspiration_of: string | null
}

export type GenderProfile = 'masculine' | 'feminine' | 'mixed'

export type PerfumeCreationStep = 1 | 2 | 3 | 4 | 5 | 6

