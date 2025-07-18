import { NextResponse } from 'next/server'

import { getServerSession } from '@/lib/auth'
import { getAllIntegrations, deleteIntegration } from '@/lib/db/queries'

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    const userIntegrations = await getAllIntegrations({ userId: user.id })

    const linearTokens = userIntegrations?.find((integration) => integration.provider === 'linear')?.access_token
    const notionTokens = userIntegrations?.find((integration) => integration.provider === 'notion')?.access_token
    const asanaTokens = userIntegrations?.find((integration) => integration.provider === 'asana')?.access_token
    const atlassianTokens = userIntegrations?.find((integration) => integration.provider === 'atlassian')?.access_token

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
      },
      {
        id: 'notion',
        name: 'Notion',
        icon: '/integration-icons/notion.png',
        isConnected: !!notionTokens,
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
        tools: asanaTokens ? [
          'Create Tasks',
          'List Tasks',
          'Update Tasks',
          'Get Projects',
          'Create Projects'
        ] : []
      },
      {
        id: 'atlassian',
        name: 'Atlassian',
        icon: '/integration-icons/atlassian.webp',
        isConnected: !!atlassianTokens,
        tools: atlassianTokens ? [
          'Create Issues',
          'List Issues',
          'Update Issues',
          'Search JQL',
          'Create Pages',
          'Search Confluence'
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

    const success = await deleteIntegration({
      userId: user.id,
      provider,
    })

    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to delete integration' }), {
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
