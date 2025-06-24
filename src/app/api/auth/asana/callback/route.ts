import { NextResponse, type NextRequest } from 'next/server';
import { saveAsanaTokens } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const userId = searchParams.get('state');

  if (!code || !userId) {
    return new Response(JSON.stringify({ error: 'Invalid request: missing code or state' }), {
      status: 400,
    });
  }

  try {
    const response = await fetch('https://app.asana.com/-/oauth_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.ASANA_CLIENT_ID!,
        client_secret: process.env.ASANA_CLIENT_SECRET!,
        redirect_uri: 'http://localhost:3000/api/auth/asana/callback',
        code,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Asana token exchange failed:', errorBody);
      return new Response(JSON.stringify({ error: 'Failed to exchange token with Asana' }), {
        status: 500,
      });
    }

    const tokenData = await response.json();

    // We will create this function in the next step
    await saveAsanaTokens({
      userId,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    });

    // Redirect user to the dashboard after successful connection
    return NextResponse.redirect(new URL('/dashboard', request.url));

  } catch (error) {
    console.error('Error in Asana OAuth callback:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
