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
    const redirectUri = process.env.NODE_ENV === 'production'
      ? 'https://affogato.app/api/auth/notion/callback'
      : 'http://localhost:3000/api/auth/notion/callback';

    const registrationResponse = await fetch('https://mcp.notion.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'Affogato Chat',
        redirect_uris: [redirectUri],
        grant_types: ['authorization_code'],
        response_types: ['code'],
        token_endpoint_auth_method: 'client_secret_post'
      }),
    });

    if (!registrationResponse.ok) {
      const errorBody = await registrationResponse.text();
      console.error('Notion MCP DCR failed:', {
        status: registrationResponse.status,
        body: errorBody
      });
      return new Response(JSON.stringify({
        error: 'Failed to register with Notion MCP',
        details: errorBody
      }), {
        status: 500,
      });
    }

    const registrationData = await registrationResponse.json();

    try {
      await saveIntegration({
        userId: user.id,
        provider: 'notion',
        clientId: registrationData.client_id,
        clientSecret: registrationData.client_secret,
      });
    } catch (error) {
      console.error('Failed to save Notion integration:', error);
    }

    const clientCredentials = {
      client_id: registrationData.client_id,
      client_secret: registrationData.client_secret,
      user_id: user.id
    };

    const notionAuthUrl = new URL('https://mcp.notion.com/authorize');
    notionAuthUrl.searchParams.set('client_id', registrationData.client_id);
    notionAuthUrl.searchParams.set('redirect_uri', redirectUri);
    notionAuthUrl.searchParams.set('response_type', 'code');
    notionAuthUrl.searchParams.set('state', Buffer.from(JSON.stringify(clientCredentials)).toString('base64'));

    return NextResponse.redirect(notionAuthUrl.toString());

  } catch (error) {
    console.error('Notion OAuth connect error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to connect to Notion',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
    });
  }
}
