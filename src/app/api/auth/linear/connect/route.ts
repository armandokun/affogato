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
    console.log('Starting Linear MCP Dynamic Client Registration...');

    // Step 1: Dynamic Client Registration
    const registrationResponse = await fetch('https://mcp.linear.app/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'Affogato Chat',
        redirect_uris: ['http://localhost:3000/api/auth/linear/callback'],
        grant_types: ['authorization_code'],
        response_types: ['code'],
        token_endpoint_auth_method: 'client_secret_post'
      }),
    });

    if (!registrationResponse.ok) {
      const errorBody = await registrationResponse.text();
      console.error('Linear DCR failed:', {
        status: registrationResponse.status,
        body: errorBody
      });
      return new Response(JSON.stringify({
        error: 'Failed to register with Linear MCP',
        details: errorBody
      }), {
        status: 500,
      });
    }

    const registrationData = await registrationResponse.json();
    console.log('Linear DCR successful:', {
      hasClientId: !!registrationData.client_id,
      hasClientSecret: !!registrationData.client_secret
    });

    // Step 2: Store client credentials temporarily (you might want to use a more persistent solution)
    // For now, we'll pass them as state parameters
    const clientCredentials = {
      client_id: registrationData.client_id,
      client_secret: registrationData.client_secret,
      user_id: user.id
    };

    // Step 3: Redirect to authorization endpoint with DCR client credentials
    const linearAuthUrl = new URL('https://mcp.linear.app/authorize');
    linearAuthUrl.searchParams.set('client_id', registrationData.client_id);
    linearAuthUrl.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/linear/callback');
    linearAuthUrl.searchParams.set('response_type', 'code');
    linearAuthUrl.searchParams.set('scope', 'read,write');
    // Encode client credentials in state (in production, use more secure storage)
    linearAuthUrl.searchParams.set('state', Buffer.from(JSON.stringify(clientCredentials)).toString('base64'));

    console.log('Redirecting to Linear authorization:', linearAuthUrl.toString());

    return NextResponse.redirect(linearAuthUrl.toString());

  } catch (error) {
    console.error('Linear MCP DCR error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to connect to Linear MCP',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
    });
  }
}
