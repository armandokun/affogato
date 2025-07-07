import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  try {
    // Check if user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('User not authenticated:', userError)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Dynamic Client Registration with Asana MCP
    const registrationResponse = await fetch('https://mcp.asana.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redirect_uris: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/asana/callback`],
        client_name: 'Affogato',
        client_uri: process.env.NEXT_PUBLIC_SITE_URL,
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        token_endpoint_auth_method: 'client_secret_post'
      })
    })

    if (!registrationResponse.ok) {
      const errorText = await registrationResponse.text()
      console.error('Asana client registration failed:', errorText)
      throw new Error(`Client registration failed: ${registrationResponse.status}`)
    }

    const clientCredentials = await registrationResponse.json()
    console.log('Asana client registered successfully:', { client_id: clientCredentials.client_id })

    // Encode client credentials in state parameter
    const stateData = {
      user_id: user.id,
      client_id: clientCredentials.client_id,
      client_secret: clientCredentials.client_secret
    }
    const state = Buffer.from(JSON.stringify(stateData)).toString('base64')

    // Build authorization URL
    const authUrl = new URL('https://mcp.asana.com/authorize')
    authUrl.searchParams.set('client_id', clientCredentials.client_id)
    authUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/asana/callback`)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('scope', 'default')

    console.log('Redirecting to Asana authorization:', authUrl.toString())
    return NextResponse.redirect(authUrl.toString())

  } catch (error) {
    console.error('Error in Asana connect:', error)
    return NextResponse.redirect(
      new URL('/dashboard/integrations?error=asana_connect_failed', request.url)
    )
  }
}
