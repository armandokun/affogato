import { NextResponse } from 'next/server'
import { saveIntegration } from '@/lib/db/queries'
import { exchangeCodeForTokens } from '@/lib/google-calendar/oauth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // userId
  const error = searchParams.get('error')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

  if (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${siteUrl}/dashboard/meetings?error=oauth_denied`)
  }

  if (!code || !state) {
    console.error('Missing OAuth parameters:', { code: !!code, state: !!state })
    return NextResponse.redirect(`${siteUrl}/dashboard/meetings?error=auth_failed`)
  }

  try {
    const redirectUri = `${siteUrl}/api/auth/google-calendar/callback`
    const tokens = await exchangeCodeForTokens(code, redirectUri)

    if (!tokens.access_token) {
      throw new Error('No access token received from Google')
    }

    if (!tokens.refresh_token) {
      console.warn(
        'No refresh token received from Google. This may indicate the user has already authorized this app previously.'
      )
    }

    await saveIntegration({
      userId: state,
      provider: 'google_calendar',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      scope: tokens.scope
    })

    return NextResponse.redirect(`${siteUrl}/dashboard/meetings?connected=true`)
  } catch (error) {
    console.error('Google Calendar OAuth callback error:', error)
    return NextResponse.redirect(`${siteUrl}/dashboard/meetings?error=connection_failed`)
  }
}
