import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { saveIntegration } from '@/lib/db/queries';

export async function GET() {
  const user = await getServerSession();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const registrationResponse = await fetch('https://atlassian-remote-mcp-production.atlassian-remote-mcp-server-production.workers.dev/v1/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'Affogato Chat',
        redirect_uris: [`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/atlassian/callback`],
        grant_types: ['authorization_code'],
        response_types: ['code'],
        token_endpoint_auth_method: 'client_secret_post'
      }),
    });

    if (!registrationResponse.ok) {
      const errorBody = await registrationResponse.text();
      console.error('Atlassian MCP DCR failed:', {
        status: registrationResponse.status,
        body: errorBody
      });
      return new Response(JSON.stringify({
        error: 'Failed to register with Atlassian MCP',
        details: errorBody
      }), {
        status: 500,
      });
    }

    const registrationData = await registrationResponse.json();

    try {
      await saveIntegration({
        userId: user.id,
        provider: 'atlassian',
        clientId: registrationData.client_id,
        clientSecret: registrationData.client_secret,
      });
    } catch (error) {
      console.error('Failed to save Atlassian integration:', error);
    }

    const clientCredentials = {
      client_id: registrationData.client_id,
      client_secret: registrationData.client_secret,
      user_id: user.id
    };

    const atlassianAuthUrl = new URL('https://mcp.atlassian.com/v1/authorize');
    atlassianAuthUrl.searchParams.set('client_id', registrationData.client_id);
    atlassianAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/atlassian/callback`);
    atlassianAuthUrl.searchParams.set('response_type', 'code');
    atlassianAuthUrl.searchParams.set('scope', 'read,write');
    atlassianAuthUrl.searchParams.set('state', Buffer.from(JSON.stringify(clientCredentials)).toString('base64'));

    return NextResponse.redirect(atlassianAuthUrl.toString());

  } catch (error) {
    console.error('Atlassian MCP DCR error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to connect to Atlassian MCP',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
    });
  }
}
