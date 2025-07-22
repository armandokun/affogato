import { NextRequest, NextResponse } from 'next/server'
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe'
import { getCurrencyFromCountry } from '@/lib/payments/currency'

export async function GET(request: NextRequest) {
  try {
    const [prices, products] = await Promise.all([
      getStripePrices(),
      getStripeProducts()
    ])

    // Get country from headers for currency detection
    const countryCode = request.headers.get('x-vercel-ip-country') || undefined
    const currency = getCurrencyFromCountry(countryCode)

    return NextResponse.json({
      prices,
      products,
      currency
    })
  } catch (error) {
    console.error('Failed to fetch pricing data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    )
  }
}
