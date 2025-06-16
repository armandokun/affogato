import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-04-30.basil'
    })

    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    })

    return NextResponse.json(
      products.data.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        defaultPriceId:
          typeof product.default_price === 'string'
            ? product.default_price
            : product.default_price?.id
      }))
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
