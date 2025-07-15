import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { saveIntegration } from '@/lib/db/queries'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  try {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('Asana OAuth error:', error)
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=asana_auth_failed', request.url)
      )
    }

    if (!code || !state) {
      console.error('Missing code or state parameter')
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=asana_missing_params', request.url)
      )
    }

    // Decode state to get client credentials
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch (decodeError) {
      console.error('Failed to decode state:', decodeError)
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=asana_invalid_state', request.url)
      )
    }

    const { user_id, client_id, client_secret } = stateData

    // Verify user matches
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user || user.id !== user_id) {
      console.error('User verification failed:', userError)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const tokenResponse = await fetch('https://mcp.asana.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/asana/callback`,
        client_id: client_id,
        client_secret: client_secret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Asana token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      })
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=asana_token_failed', request.url)
      )
    }

    const tokens = await tokenResponse.json()

    await saveIntegration({
      userId: user.id,
      provider: 'asana',
      clientId: client_id,
      clientSecret: client_secret,
      accessToken: tokens.access_token,
    })
    return NextResponse.redirect(
      new URL('/dashboard/integrations?success=asana_connected', request.url)
    )

  } catch (error) {
    console.error('Error in Asana callback:', error)
    return NextResponse.redirect(
      new URL('/dashboard/integrations?error=asana_callback_failed', request.url)
    )
  }
}
