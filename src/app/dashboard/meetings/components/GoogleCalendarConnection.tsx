'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '@/components/ui/card'
import { Button } from '@/components/ui/button/button'

interface Integration {
  platform: string
  connected: boolean
  email?: string
}

export function GoogleCalendarConnection() {
  const [integration, setIntegration] = useState<Integration | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for URL parameters indicating connection status
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')

    if (connected === 'true') {
      setMessage('✅ Successfully connected to Google Calendar!')
      setIntegration({
        platform: 'google-calendar',
        connected: true,
        email: 'Connected successfully'
      })
    } else if (error) {
      const errorMessages: { [key: string]: string } = {
        connection_failed: '❌ Failed to connect to Google Calendar. Please try again.',
        oauth_denied: '❌ Google Calendar access was denied.',
        auth_failed: '❌ Authentication failed. Please try again.'
      }
      setMessage(errorMessages[error] || '❌ An error occurred during connection.')
      setIntegration({
        platform: 'google-calendar',
        connected: false
      })
    } else {
      // Check if user has existing integration
      checkConnectionStatus()
    }

    // Clear message after 5 seconds
    if (connected || error) {
      setTimeout(() => setMessage(null), 5000)
    }
  }, [searchParams])

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/auth/google-calendar/status')
      if (response.ok) {
        const data = await response.json()
        setIntegration({
          platform: 'google-calendar',
          connected: data.connected,
          email: data.email
        })
      } else {
        setIntegration({
          platform: 'google-calendar',
          connected: false
        })
      }
    } catch (error) {
      console.error('Failed to check connection status:', error)
      setIntegration({
        platform: 'google-calendar',
        connected: false
      })
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    try {
      // Use window.location.href for OAuth redirect instead of fetch
      window.location.href = '/api/auth/google-calendar/connect'
    } catch (error) {
      console.error('Failed to connect to Google Calendar:', error)
      setLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setLoading(true)
    try {
      // TODO: Implement disconnect endpoint
      console.log('Disconnect functionality to be implemented')
    } catch (error) {
      console.error('Failed to disconnect:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!integration) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">{message}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Google Calendar</h3>
              <p className="text-sm text-muted-foreground">
                {integration?.connected
                  ? `Connected as ${integration.email}`
                  : 'Connect your Google Calendar to get started'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${integration?.connected ? 'bg-green-500' : 'bg-gray-300'}`}
          />
          <span className="text-sm font-medium">
            {integration?.connected ? 'Connected' : 'Not connected'}
          </span>
          {integration?.connected ? (
            <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={loading}>
              Disconnect
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={loading} size="sm">
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
