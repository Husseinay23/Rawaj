import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const body = await request.json()
    const { quantity } = updateCartItemSchema.parse(body)

    if (quantity === undefined) {
      return NextResponse.json({ error: 'Quantity required' }, { status: 400 })
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity },
      include: { product: true, customPerfume: true },
    })

    return NextResponse.json({ item: cartItem })
  } catch (error) {
    console.error('Error updating cart item:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    await prisma.cartItem.delete({
      where: { id: params.itemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting cart item:', error)
    return NextResponse.json({ error: 'Failed to delete cart item' }, { status: 500 })
  }
}

