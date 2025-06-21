import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/payments/stripe'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (token_hash && type) {
    const supabase = await createClient()

    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash
    })

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

              const url = request.nextUrl.clone()
              url.pathname = '/error'
              return NextResponse.redirect(url)
            }

            cookieStore.set('stripe_session_id', '', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/'
            })

            const redirectPagePath = '/dashboard'
            const redirectTo = request.nextUrl.clone()
            redirectTo.pathname = redirectPagePath
            redirectTo.searchParams.delete('token_hash')
            redirectTo.searchParams.delete('type')

            return NextResponse.redirect(redirectTo)
          }
        } catch (error) {
          console.error('Error linking Stripe customer:', error)

          const url = request.nextUrl.clone()
          url.pathname = '/error'

          return NextResponse.redirect(url)
        }
      }
    }
  }

  const url = request.nextUrl.clone()
  url.pathname = '/error'

  return NextResponse.redirect(url)
}
