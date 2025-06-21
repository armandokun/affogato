import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { stripe } from '@/lib/payments/stripe'

export async function POST(request: Request) {
  try {
    const { priceId, email } = await request.json()

    if (!priceId) {
      return new NextResponse('Missing priceId', { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/login?signup=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}#pricing`,
      allow_promotion_codes: true,
      customer_email: email,
      metadata: {
        priceId
      }
    })


    const cookieStore = await cookies()

    cookieStore.set('stripe_session_id', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return NextResponse.json({ sessionUrl: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)

    return new NextResponse('Error creating checkout session', { status: 500 })
  }
}
