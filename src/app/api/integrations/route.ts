import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getOAuthTokens } from '@/lib/db/queries'

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    const linearTokens = await getOAuthTokens({ userId: user.id, provider: 'linear' })

    const integrations = [
      {
        id: 'linear',
        name: 'Linear',
        icon: '/integration-icons/linear.png',
        isConnected: !!linearTokens,
        tools: linearTokens ? [
          'Create Issues',
          'Search Issues',
          'Update Issues',
          'Get Teams',
          'Get Projects'
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
