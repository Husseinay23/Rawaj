import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { OrderStatus } from '@prisma/client'

const createOrderSchema = z.object({
  shippingAddress: z.object({
    name: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    name: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  paymentProvider: z.string().optional(),
  paymentStatus: z.string().optional(),
})

// Generate unique order number
function generateOrderNumber(): string {
  return `RAW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const cookieStore = cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    if (!session?.user?.id && !sessionId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { shippingAddress, billingAddress, paymentProvider, paymentStatus } =
      createOrderSchema.parse(body)

    // Get cart
    const cart = await prisma.cart.findFirst({
      where: {
        ...(session?.user?.id ? { userId: session.user.id } : { sessionId }),
      },
      include: {
        items: {
          include: {
            product: true,
            customPerfume: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    )
    const shipping = 10.0 // Fixed shipping for now
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + shipping + tax

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id,
        orderNo: generateOrderNumber(),
        status: OrderStatus.PENDING,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress,
        billingAddress,
        paymentProvider,
        paymentStatus,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            customPerfumeId: item.customPerfumeId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            customPerfume: true,
          },
        },
      },
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
            customPerfume: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

