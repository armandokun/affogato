import { Suspense } from 'react'
import { ExternalLink, Settings } from 'lucide-react'

import { getServerSession } from '@/lib/auth'
import { getOAuthTokens } from '@/lib/db/queries'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connectUrl: string
  isConnected: boolean
  tools?: string[]
}

async function IntegrationsContent() {
  const user = await getServerSession()

  if (!user) {
    return <div>Please log in to manage integrations</div>
  }

  // Check which integrations are connected
  const linearTokens = await getOAuthTokens({ userId: user.id, provider: 'linear' })

  const integrations: Integration[] = [
    {
      id: 'linear',
      name: 'Linear',
      description: 'Project management and issue tracking for modern software teams',
      icon: '🔗',
      connectUrl: '/api/auth/linear/connect',
      isConnected: !!linearTokens,
      tools: linearTokens
        ? ['Create Issues', 'Search Issues', 'Update Issues', 'Get Teams', 'Get Projects']
        : []
    }
  ]

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect external services to enhance your AI assistant with powerful tools and data
          sources.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{integration.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {integration.isConnected ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          Not Connected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{integration.description}</p>

              {integration.tools && integration.tools.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Tools:</h4>
                  <div className="flex flex-wrap gap-1">
                    {integration.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                {integration.isConnected ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button asChild className="flex-1">
                    <a href={integration.connectUrl}>Connect {integration.name}</a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Future integrations placeholder */}
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-600 mb-2">More Integrations Coming Soon</h3>
        <p className="text-gray-500">
          We're working on adding support for more services like Slack, Jira, GitHub, and more.
        </p>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div>Loading integrations...</div>}>
      <IntegrationsContent />
    </Suspense>
  )
}
