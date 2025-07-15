import { NextRequest } from 'next/server';
import { saveIntegration } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const encodedState = searchParams.get('state');

  if (!code || !encodedState) {
    console.error('Missing required parameters:', { code: !!code, state: !!encodedState });

    return new Response(JSON.stringify({ error: 'Invalid request: missing code or state' }), {
      status: 400,
    });
  }

  try {
    const clientCredentials = JSON.parse(Buffer.from(encodedState, 'base64').toString());
    const { client_id, client_secret, user_id } = clientCredentials;

    if (!client_id || !client_secret || !user_id) {
      console.error('Invalid state data:', {
        hasClientId: !!client_id,
        hasClientSecret: !!client_secret,
        hasUserId: !!user_id
      });
      return new Response(JSON.stringify({ error: 'Invalid state data' }), {
        status: 400,
      });
    }

    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id,
      client_secret,
      redirect_uri: 'http://localhost:3000/api/auth/linear/callback',
      code,
    });

    const response = await fetch('https://mcp.linear.app/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Linear token exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      return new Response(JSON.stringify({
        error: 'Failed to exchange token with Linear MCP',
        details: responseText
      }), {
        status: 500,
      });
    }

    const tokenData = JSON.parse(responseText);

    try {
      await saveIntegration({
        userId: user_id,
        provider: 'linear',
        clientId: client_id,
        clientSecret: client_secret,
        accessToken: tokenData.access_token,
      });
    } catch (dbError) {
      console.error('Database error details:', {
        error: dbError,
        userId: user_id,
        provider: 'linear',
        hasAccessToken: !!tokenData.access_token,
        hasClientId: !!client_id,
        hasClientSecret: !!client_secret,
      });
      throw dbError;
    }

    return Response.redirect(new URL('/dashboard/integrations', request.url));

  } catch (error) {
    console.error('Linear OAuth callback error:', error);
    return new Response(JSON.stringify({
      error: 'OAuth callback failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
    });
  }
}
