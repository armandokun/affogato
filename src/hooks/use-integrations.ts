import { useState, useEffect, useCallback } from 'react'

export interface ConnectedIntegration {
  id: string
  name: string
  icon: string
  isConnected: boolean
  tools: string[]
}

export function useIntegrations(userId?: string) {
  const [integrations, setIntegrations] = useState<ConnectedIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIntegrations = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/integrations')

      if (!response.ok) {
        throw new Error('Failed to fetch integrations')
      }

      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (err) {
      console.error('Error fetching integrations:', err)
      setError('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchIntegrations()
  }, [fetchIntegrations])

  const connectedIntegrations = integrations.filter(integration => integration.isConnected)
  const hasConnectedIntegrations = connectedIntegrations.length > 0

  return {
    integrations,
    connectedIntegrations,
    hasConnectedIntegrations,
    loading,
    error,
    refetch: fetchIntegrations
  }
}
