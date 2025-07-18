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
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/atlassian/callback`,
      code,
    });

    const response = await fetch('https://atlassian-remote-mcp-production.atlassian-remote-mcp-server-production.workers.dev/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Atlassian token exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      return new Response(JSON.stringify({
        error: 'Failed to exchange token with Atlassian MCP',
        details: responseText
      }), {
        status: 500,
      });
    }

    const tokenData = JSON.parse(responseText);

    if (!tokenData.access_token) {
      console.error('No access token received from Atlassian:', tokenData);
      return new Response(JSON.stringify({
        error: 'No access token received from Atlassian MCP',
        details: tokenData
      }), {
        status: 500,
      });
    }

    try {
      await saveIntegration({
        userId: user_id,
        provider: 'atlassian',
        clientId: client_id,
        clientSecret: client_secret,
        accessToken: tokenData.access_token,
      });

      return Response.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?success=atlassian_connected`);
    } catch (error) {
      console.error('Failed to save Atlassian integration:', error);
      return Response.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?error=atlassian_save_failed`);
    }
  } catch (error) {
    console.error('Error in Atlassian callback:', error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?error=atlassian_callback_failed`);
  }
}
