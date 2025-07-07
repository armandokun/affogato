import { Suspense } from 'react'
import { ChevronRight, X, Info, RefreshCw, AlertTriangle } from 'lucide-react'
import Image from 'next/image'

import { getServerSession } from '@/lib/auth'
import { getOAuthTokensFromProvider } from '@/lib/db/queries'
import Button from '@/components/ui/button'
import PageHeading from '@/components/general/page-heading'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet/sheet'
import { AVAILABLE_INTEGRATIONS, Integration, IntegrationTool } from '@/constants/integrations'

function ToolsModal({ integration }: { integration: Integration }) {
  const groupedTools = integration.tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = []
      }
      acc[tool.category].push(tool)
      return acc
    },
    {} as Record<string, IntegrationTool[]>
  )

  return (
    <Sheet>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-muted-foreground">{integration.tools.length} tools:</span>
        <div className="flex flex-wrap gap-1">
          {integration.tools.slice(0, 3).map((tool) => (
            <SheetTrigger key={tool.name} asChild>
              <button className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded border border-blue-200 cursor-pointer hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/50">
                {tool.name}
              </button>
            </SheetTrigger>
          ))}
          {integration.tools.length > 3 && (
            <SheetTrigger asChild>
              <button className="text-xs text-muted-foreground flex items-center cursor-pointer hover:underline">
                +{integration.tools.length - 3} more
                <ChevronRight className="h-3 w-3 ml-1" />
              </button>
            </SheetTrigger>
          )}
        </div>
      </div>
      <SheetContent className="sm:max-w-[600px] w-full flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <Image
              src={integration.icon}
              alt={integration.name}
              width={32}
              height={32}
              className="rounded-md"
            />
            <div>
              <SheetTitle>{integration.name} Tools</SheetTitle>
              <SheetDescription>
                Available tools for {integration.name} integration
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-6 pr-2 -mr-2">
          <div className="space-y-6">
            {Object.entries(groupedTools).map(([category, tools]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-foreground mb-3">{category}</h3>
                <div className="space-y-3">
                  {tools.map((tool) => (
                    <div key={tool.name} className="border border-border rounded-lg p-4 bg-card/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{tool.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="p-4 border border-border rounded-lg bg-muted/50">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground text-sm">How to use these tools</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    These tools are available when chatting with your AI assistant. Simply describe
                    what you want to do with {integration.name} and the AI will use the appropriate
                    tools to help you accomplish your tasks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Client component for handling token removal
function RemoveTokenButton({ provider }: { provider: string }) {
  const handleRemoveToken = async () => {
    try {
      const response = await fetch('/api/integrations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider })
      })

      if (response.ok) {
        // Refresh the page to update the UI
        window.location.reload()
      } else {
        console.error('Failed to remove token')
      }
    } catch (error) {
      console.error('Error removing token:', error)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRemoveToken}
      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
      <RefreshCw className="w-4 h-4 mr-2" />
      Re-authenticate
    </Button>
  )
}

async function IntegrationStatus({
  userId,
  integration
}: {
  userId: string
  integration: Integration
}) {
  const tokens = await getOAuthTokensFromProvider({ userId, provider: integration.id })
  const isConnected = !!tokens

  // Check if token is expired
  let isExpired = false
  if (tokens?.expiresAt) {
    const expirationTime = new Date(tokens.expiresAt).getTime()
    isExpired = expirationTime <= Date.now()
  }

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent transition-colors bg-background">
      <div className="flex items-start space-x-4">
        <Image
          src={integration.icon}
          alt={integration.name}
          width={40}
          height={40}
          className="rounded-md"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {isConnected && !isExpired ? (
              <a
                href={integration.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-foreground hover:text-accent-foreground hover:underline transition-colors">
                {integration.name}
              </a>
            ) : (
              <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
            )}
            {isConnected && !isExpired ? (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                Connected
              </span>
            ) : isConnected && isExpired ? (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Token Expired
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                Not Connected
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
          {isConnected && isExpired && (
            <p className="text-sm text-yellow-600 mt-1">
              Your {integration.name} token has expired. Re-authenticate to restore access to your
              tools.
            </p>
          )}
          {integration.tools.length > 0 && isConnected && !isExpired && (
            <ToolsModal integration={integration} />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isConnected ? (
          <Button asChild>
            <a href={integration.connectUrl}>Connect</a>
          </Button>
        ) : isExpired ? (
          <RemoveTokenButton provider={integration.id} />
        ) : null}
      </div>
    </div>
  )
}

function IntegrationSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-muted rounded-md" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-5 w-20 bg-muted rounded-full" />
          </div>
          <div className="h-4 w-64 bg-muted rounded mt-1" />
          <div className="flex items-center gap-2 mt-2">
            <div className="h-3 w-12 bg-muted rounded" />
            <div className="flex gap-1">
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded" />
              <div className="h-5 w-16 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-muted rounded" />
      </div>
    </div>
  )
}

async function IntegrationsContent() {
  const user = await getServerSession()

  if (!user) {
    return <div>Please log in to manage integrations</div>
  }

  return (
    <div className="space-y-3">
      {AVAILABLE_INTEGRATIONS.map((integration) => (
        <Suspense key={integration.id} fallback={<IntegrationSkeleton />}>
          <IntegrationStatus userId={user.id} integration={integration} />
        </Suspense>
      ))}

      <div className="flex items-center justify-between p-4 border-2 border-dashed border-border rounded-lg hover:border-secondary transition-colors bg-card/50">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-secondary/20 rounded-md flex items-center justify-center border border-secondary/30">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Missing an Integration?</h3>
            <p className="text-sm text-muted-foreground">
              Let us know what integration would help your workflow.
            </p>
          </div>
        </div>
        <Button asChild>
          <a href="mailto:armandas@affogato.ai?subject=Integration Request&body=Hi! I'd like to request an integration with:">
            Request
          </a>
        </Button>
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto space-y-6 px-6 py-4">
      <PageHeading
        title="Integrations"
        description="Connect external services to enhance your AI assistant with powerful tools and data sources."
      />

      <IntegrationsContent />
    </div>
  )
}
