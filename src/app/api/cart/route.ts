import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { z } from 'zod'
import { cookies } from 'next/headers'

const addToCartSchema = z.object({
  productId: z.string().optional(),
  customPerfumeId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
})

// Get or create cart
async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true, customPerfume: true } } },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true, customPerfume: true } } },
      })
    }

    return cart
  } else if (sessionId) {
    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: true, customPerfume: true } } },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId },
        include: { items: { include: { product: true, customPerfume: true } } },
      })
    }

    return cart
  }

  throw new Error('User ID or session ID required')
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const cookieStore = cookies()
    let sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      cookieStore.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    const cart = await getOrCreateCart(session?.user?.id, sessionId)

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const cookieStore = cookies()
    let sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      cookieStore.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    const body = await request.json()
    const { productId, customPerfumeId, quantity } = addToCartSchema.parse(body)

    if (!productId && !customPerfumeId) {
      return NextResponse.json({ error: 'Product or custom perfume required' }, { status: 400 })
    }

    const cart = await getOrCreateCart(session?.user?.id, sessionId)

    // Get price
    let unitPrice = 0
    if (productId) {
      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      unitPrice = Number(product.price)
    } else if (customPerfumeId) {
      const customPerfume = await prisma.customPerfume.findUnique({
        where: { id: customPerfumeId },
      })
      if (!customPerfume) {
        return NextResponse.json({ error: 'Custom perfume not found' }, { status: 404 })
      }
      unitPrice = Number(customPerfume.price)
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        ...(productId ? { productId } : { customPerfumeId }),
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true, customPerfume: true },
      })
      return NextResponse.json({ item: updatedItem })
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        customPerfumeId,
        quantity,
        unitPrice,
      },
      include: { product: true, customPerfume: true },
    })

    return NextResponse.json({ item: cartItem }, { status: 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

