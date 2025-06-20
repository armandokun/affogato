import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

import { handleSubscriptionChange, handleSubscriptionCreated, stripe } from '@/lib/payments/stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err)

    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 })
  }

  const subscription = event.data.object as Stripe.Subscription

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionChange(subscription)

      break
    case 'customer.subscription.created':
      await handleSubscriptionCreated(subscription)

      break
    default:
      break
  }

  return NextResponse.json({ received: true })
}
