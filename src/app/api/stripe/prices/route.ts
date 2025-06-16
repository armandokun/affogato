import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
})

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
      type: 'recurring'
    })

    return NextResponse.json(
      prices.data.map((price) => ({
        id: price.id,
        productId: typeof price.product === 'string' ? price.product : price.product.id,
        unitAmount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
        trialPeriodDays: price.recurring?.trial_period_days
      }))
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
