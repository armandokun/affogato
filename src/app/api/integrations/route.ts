import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getAllOAuthTokens, deleteOAuthTokens } from '@/lib/db/queries'

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    const oauthTokens = await getAllOAuthTokens({ userId: user.id })

    const linearTokens = oauthTokens?.find((token) => token.provider === 'linear')
    const notionTokens = oauthTokens?.find((token) => token.provider === 'notion')
    const asanaTokens = oauthTokens?.find((token) => token.provider === 'asana')

    // Check if tokens are expired
    const checkTokenExpired = (token: any) => {
      if (!token?.expires_at) return false; // Notion tokens don't expire
      const expirationTime = new Date(token.expires_at).getTime();
      return expirationTime <= Date.now();
    };

    const integrations = [
      {
        id: 'linear',
        name: 'Linear',
        icon: '/integration-icons/linear.png',
        isConnected: !!linearTokens,
        isExpired: linearTokens ? checkTokenExpired(linearTokens) : false,
        tools: linearTokens && !checkTokenExpired(linearTokens) ? [
          'Create Issues',
          'Search Issues',
          'Update Issues',
          'Get Teams',
          'Get Projects'
        ] : []
      },
      {
        id: 'notion',
        name: 'Notion',
        icon: '/integration-icons/notion.png',
        isConnected: !!notionTokens,
        isExpired: false, // Notion tokens don't expire
        tools: notionTokens ? [
          'Create Pages',
          'Search Pages',
          'Update Pages',
          'Get Databases',
          'Get Pages'
        ] : []
      },
      {
        id: 'asana',
        name: 'Asana',
        icon: '/integration-icons/asana.png',
        isConnected: !!asanaTokens,
        isExpired: asanaTokens ? checkTokenExpired(asanaTokens) : false,
        tools: asanaTokens && !checkTokenExpired(asanaTokens) ? [
          'Create Tasks',
          'List Tasks',
          'Update Tasks',
          'Get Projects',
          'Create Projects'
        ] : []
      }
    ]

    return NextResponse.json({ integrations })
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch integrations' }), {
      status: 500,
    })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getServerSession()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    const { provider } = await request.json()

    if (!provider) {
      return new Response(JSON.stringify({ error: 'Provider is required' }), {
        status: 400,
      })
    }

    const success = await deleteOAuthTokens({
      userId: user.id,
      provider,
    })

    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to delete tokens' }), {
        status: 500,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tokens:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete tokens' }), {
      status: 500,
    })
  }
}
