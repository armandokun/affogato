import { NextRequest } from 'next/server';
import { saveIntegration } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const encodedState = searchParams.get('state');

  console.log('Linear OAuth callback received:', {
    hasCode: !!code,
    hasState: !!encodedState,
    codePrefix: code?.substring(0, 10) + '...'
  });

  if (!code || !encodedState) {
    console.error('Missing required parameters:', { code: !!code, state: !!encodedState });
    return new Response(JSON.stringify({ error: 'Invalid request: missing code or state' }), {
      status: 400,
    });
  }

  try {
    // Decode client credentials from state
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

    console.log('Attempting token exchange with Linear MCP DCR credentials...');

    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id,
      client_secret,
      redirect_uri: 'http://localhost:3000/api/auth/linear/callback',
      code,
    });

    console.log('Token exchange request details:', {
      url: 'https://mcp.linear.app/token',
      clientIdPrefix: client_id.substring(0, 8) + '...',
      hasClientSecret: !!client_secret,
      hasCode: !!code
    });

    const response = await fetch('https://mcp.linear.app/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    const responseText = await response.text();
    console.log('Linear token exchange response:', {
      status: response.status,
      statusText: response.statusText,
      hasBody: !!responseText,
      bodyLength: responseText.length
    });

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
    console.log('Linear token exchange successful:', {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type
    });

    // Save the OAuth tokens to the database
    console.log('Attempting to save OAuth tokens:', {
      userId: user_id,
      provider: 'linear',
      hasAccessToken: !!tokenData.access_token,
      expiresIn: tokenData.expires_in
    });

    try {
      await saveIntegration({
        userId: user_id,
        provider: 'linear',
        clientId: client_id,
        clientSecret: client_secret,
        accessToken: tokenData.access_token,
      });
      console.log('Linear integration saved successfully');
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

    // Redirect back to the dashboard
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
