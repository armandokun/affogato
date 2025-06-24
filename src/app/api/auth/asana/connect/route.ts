import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  const user = await getServerSession();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  const clientId = process.env.ASANA_CLIENT_ID;
  console.log('ASANA_CLIENT_ID loaded in connect route:', clientId);

  if (!clientId) {
    return new Response(JSON.stringify({ error: 'ASANA_CLIENT_ID is not configured on the server.' }), {
      status: 500,
    });
  }

  const asanaAuthUrl = new URL('https://app.asana.com/-/oauth_authorize');
  asanaAuthUrl.searchParams.set('client_id', clientId);
  asanaAuthUrl.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/asana/callback');
  asanaAuthUrl.searchParams.set('response_type', 'code');
  // You might need to add specific scopes here depending on what tools you want to use
  asanaAuthUrl.searchParams.set('scope', 'default');
  asanaAuthUrl.searchParams.set('state', user.id); // Using user ID as state to identify the user in the callback

  return NextResponse.redirect(asanaAuthUrl.toString());
}
