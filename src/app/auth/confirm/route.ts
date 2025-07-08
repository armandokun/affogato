import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/payments/stripe'
import { CHECKOUT_SUCCESS } from '@/constants/routes'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!token_hash || !type) {
    const url = request.nextUrl.clone()
    url.pathname = '/error'
    url.searchParams.set('error', 'Missing token_hash or type')

    return NextResponse.redirect(url)
  }

  const supabase = await createClient()

  const { error, data } = await supabase.auth.verifyOtp({
    type,
    token_hash
  })

  if (error) {
    const url = request.nextUrl.clone()
    url.pathname = '/error'
    url.searchParams.set('error', error.message || 'Authentication failed')
    return NextResponse.redirect(url)
  }

  if (!data?.user) {
    const url = request.nextUrl.clone()
    url.pathname = '/error'
    url.searchParams.set('error', 'No user data received')
    return NextResponse.redirect(url)
  }

  const cookieStore = await cookies()
  const sessionId = cookieStore.get('stripe_session_id')?.value

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (session.customer) {
        const adminSupabase = await createClient(process.env.SUPABASE_SERVICE_ROLE_KEY)

        const { error: linkError } = await adminSupabase
          .from('subscriptions')
          .update({ user_id: data.user.id })
          .eq('stripe_customer_id', session.customer)

        if (linkError) {
          console.error('Error linking Stripe customer:', linkError)
          const url = request.nextUrl.clone()
          url.pathname = '/error'
          url.searchParams.set('error', 'Failed to link subscription')
          return NextResponse.redirect(url)
        }

        cookieStore.set('stripe_session_id', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        })
      }
    } catch (stripeError) {
      const url = request.nextUrl.clone()
      url.pathname = '/error'
      url.searchParams.set('error', stripeError instanceof Error ? stripeError.message : 'Failed to process subscription')

      return NextResponse.redirect(url)
    }
  }

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = CHECKOUT_SUCCESS
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  return NextResponse.redirect(redirectTo)
}
