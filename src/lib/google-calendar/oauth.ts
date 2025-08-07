// Google OAuth utilities for Google Calendar integration

export function getGoogleAuthUrl(userId: string) {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly'
  ]

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google-calendar/callback`,
    scope: scopes.join(' '),
    response_type: 'code',
    access_type: 'offline',
    state: userId,
    prompt: 'consent'
  })}`

  return authUrl
}

export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code for tokens: ${error}`)
  }

  return await response.json()
}
