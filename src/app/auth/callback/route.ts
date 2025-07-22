import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { stripe } from '@/lib/payments/stripe'
import { createClient } from '@/lib/supabase/server'
import { constructUrlWithParams } from '@/lib/utils/url/url'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? ''

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const cookieStore = await cookies()
      const sessionId = cookieStore.get('stripe_session_id')?.value

      if (sessionId && data?.user) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId)

          if (session.customer) {
            const adminSupabase = await createClient(process.env.SUPABASE_SERVICE_ROLE_KEY)

            const { error } = await adminSupabase
              .from('subscriptions')
              .update({ user_id: data.user.id })
              .eq('stripe_customer_id', session.customer)

            if (error) {
              console.error('Error linking Stripe customer:', error)

              return NextResponse.redirect(`${origin}/error`)
            }

            cookieStore.set('stripe_session_id', '', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/'
            })
          }
        } catch (error) {
          console.error('Error linking Stripe customer:', error)
          return NextResponse.redirect(`${origin}/error`)
        }
      }

      return NextResponse.redirect(constructUrlWithParams(origin, {
        next
      }))
    }
  }

  return NextResponse.redirect(`${origin}/error`)
}
