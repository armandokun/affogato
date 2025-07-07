import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  const user = await getServerSession();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    console.log('Starting Notion MCP Dynamic Client Registration...');

    const redirectUri = process.env.NODE_ENV === 'production'
      ? 'https://affogato.app/api/auth/notion/callback'
      : 'http://localhost:3000/api/auth/notion/callback';

    // Step 1: Dynamic Client Registration
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
    console.log('Notion MCP DCR successful:', {
      hasClientId: !!registrationData.client_id,
      hasClientSecret: !!registrationData.client_secret
    });

    // Step 2: Store client credentials temporarily in state parameter
    const clientCredentials = {
      client_id: registrationData.client_id,
      client_secret: registrationData.client_secret,
      user_id: user.id
    };

    // Step 3: Redirect to authorization endpoint with DCR client credentials
    const notionAuthUrl = new URL('https://mcp.notion.com/authorize');
    notionAuthUrl.searchParams.set('client_id', registrationData.client_id);
    notionAuthUrl.searchParams.set('redirect_uri', redirectUri);
    notionAuthUrl.searchParams.set('response_type', 'code');
    // Encode client credentials in state (in production, use more secure storage)
    notionAuthUrl.searchParams.set('state', Buffer.from(JSON.stringify(clientCredentials)).toString('base64'));

    console.log('Redirecting to Notion MCP authorization:', notionAuthUrl.toString());

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
