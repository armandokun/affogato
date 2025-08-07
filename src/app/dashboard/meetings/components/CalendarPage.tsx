'use client'

import { useState, useEffect } from 'react'
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'
import Image from 'next/image'

import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import { SidebarTrigger } from '@/components/general/sidebar/sidebar'

import DisclosureDialog from './DisclosureDialog'
import { useSession } from '@/containers/SessionProvider'
import { redirect } from 'next/navigation'

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  hangoutLink?: string
  location?: string
  attendees?: Array<{ email: string; displayName: string }>
  transcriptionEnabled?: boolean
}

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showDisclosureDialog, setShowDisclosureDialog] = useState(false)

  const { user } = useSession()

  useEffect(() => {
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/google-calendar/status')
      if (response.ok) {
        const data = await response.json()
        setIsConnected(data.connected)

        if (data.connected) {
          await loadEvents()
        }
      }
    } catch (error) {
      console.error('Failed to check connection status:', error)
      setIsConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/meetings/sync', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        const formattedEvents = data.events.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          transcriptionEnabled: false
        }))
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error('Failed to load events:', error)
    }
  }

  const handleConnect = () => {
    if (!user) {
      alert('You must be logged in to connect your Google Calendar.')

      return
    }

    redirect('/api/auth/google-calendar/connect')
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/auth/google-calendar/disconnect', { method: 'POST' })
      if (response.ok) {
        setIsConnected(false)
        setEvents([])
        setSelectedEvent(null)
      } else {
        console.error('Failed to disconnect Google Calendar')
      }
    } catch (error) {
      console.error('Failed to disconnect Google Calendar:', error)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    await loadEvents()
    setSyncing(false)
  }

  const toggleTranscription = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, transcriptionEnabled: !event.transcriptionEnabled }
          : event
      )
    )
  }

  const getDatePrefix = (date: Date) => {
    if (isToday(date)) {
      return 'Today'
    } else if (isTomorrow(date)) {
      return 'Tomorrow'
    } else if (isThisWeek(date)) {
      return format(date, 'EEE d') // Wed 6
    } else {
      return format(date, 'MMM d') // Jan 15
    }
  }

  // Separate events into previous and upcoming
  const now = new Date()
  const previousEvents = events.filter(event => event.start < now)
  const upcomingEvents = events.filter(event => event.start >= now)

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen md:min-h-[calc(100vh-4rem)] p-4">
          <div className="max-w-xl space-y-6 text-center w-full">
            <div className="absolute top-4 left-4">
              <SidebarTrigger />
            </div>
            <div className="flex justify-center mx-auto mb-4 relative">
              <Image
                src="/meetings/connect.png"
                alt="Connect Google Calendar illustration"
                width={250}
                height={450}
                className="object-contain"
                priority
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Chat with your meetings</h2>
              <p className="text-muted-foreground">
                Connect your calendar to let our AI agent join, transcribe your meetings
                automatically and intelligently offer you insights.
              </p>
            </div>

            {/* How it works - ordered list with circled numbers */}
            <div className="text-center space-y-3 bg-muted/30 p-4 rounded-lg border border-border">
              <ol className="space-y-2 text-muted-foreground text-sm">
                {[
                  'Connect your calendar to securely sync your upcoming meetings.',
                  'Our AI agent automatically joins your meetings to take notes.',
                  'After the meeting, receive notes and ask follow-up questions in the chat.'
                ].map((text, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="flex items-center justify-center size-6 rounded-full text-white border border-primary font-semibold text-xs mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-3 flex justify-center items-center flex-col">
              <div className="text-sm font-semibold mb-2">Connect With</div>
              <Button onClick={handleConnect} className="flex items-center justify-center mb-0">
                <Image
                  src="/integration-icons/google-calendar.png"
                  alt="Google logo"
                  width={20}
                  height={20}
                  className="inline-block"
                />
                Google Calendar
              </Button>
              <Button
                variant="link"
                className="text-xs text-muted-foreground"
                onClick={() => setShowDisclosureDialog(true)}>
                View Google disclosure
              </Button>
            </div>
          </div>
        </div>
        <DisclosureDialog show={showDisclosureDialog} onOpenChange={setShowDisclosureDialog} />
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
            Disconnect Google Calendar
          </Button>
        </div>
        <p className="text-muted-foreground">
          Connect your Google Calendar and let our AI agent join and transcribe your meetings.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              {upcomingEvents.length} upcoming • {previousEvents.length} previous • {events.filter((e) => e.transcriptionEnabled).length}{' '}
              with AI transcription
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Syncing...' : 'Sync Calendar'}
          </Button>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No meetings found</h3>
            <p className="text-muted-foreground mb-4">
              Your connected calendar doesn't have any meetings.
            </p>
            <Button variant="outline" onClick={handleSync} disabled={syncing}>
              {syncing ? 'Checking...' : 'Refresh Calendar'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Meetings Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {upcomingEvents.length}
                </span>
              </div>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-3">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <p className="text-sm">No upcoming meetings</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`cursor-pointer transition-shadow hover:shadow-md`}
                    onClick={() => setSelectedEvent(event)}>
                    <Card
                      className={`p-4 border-l-4 ${
                        event.transcriptionEnabled
                          ? 'border-l-green-500 bg-green-50/30'
                          : event.hangoutLink
                            ? 'border-l-blue-500'
                            : 'border-l-gray-300'
                      }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Calendar Icon and Date */}
                          <div className="flex flex-col items-center min-w-[60px]">
                            <div className="w-10 h-10 bg-red-500 rounded-lg flex flex-col items-center justify-center text-white shadow-sm">
                              <div className="text-[8px] font-medium leading-none">
                                {format(event.start, 'MMM').toUpperCase()}
                              </div>
                              <div className="text-sm font-bold leading-none mt-0.5">
                                {format(event.start, 'd')}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1 text-center">
                              {getDatePrefix(event.start)}
                            </span>
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm truncate">{event.title}</h4>
                              {event.transcriptionEnabled && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                  🎙️ AI Enabled
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground mb-1">
                              {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {event.hangoutLink && (
                                <span className="flex items-center gap-1">📹 Google Meet</span>
                              )}
                              {event.location && !event.hangoutLink && (
                                <span className="flex items-center gap-1 truncate">
                                  📍 {event.location}
                                </span>
                              )}
                              {event.attendees && event.attendees.length > 1 && (
                                <span className="flex items-center gap-1">
                                  👥 {event.attendees.length} attendees
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Toggle Button */}
                        <Button
                          variant={event.transcriptionEnabled ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTranscription(event.id)
                          }}
                          className="ml-2">
                          {event.transcriptionEnabled ? '✓ Enabled' : 'Enable AI'}
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </div>

            {/* Previous Meetings Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Previous Meetings</h3>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {previousEvents.length}
                </span>
              </div>
              {previousEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-3">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <p className="text-sm">No previous meetings</p>
                </div>
              ) : (
                previousEvents
                  .sort((a, b) => b.start.getTime() - a.start.getTime()) // Sort by most recent first
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`cursor-pointer transition-shadow hover:shadow-md`}
                      onClick={() => setSelectedEvent(event)}>
                      <Card
                        className={`p-4 border-l-4 ${
                          event.transcriptionEnabled
                            ? 'border-l-green-500 bg-green-50/30'
                            : 'border-l-gray-400 opacity-75'
                        }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {/* Calendar Icon and Date */}
                            <div className="flex flex-col items-center min-w-[60px]">
                              <div className="w-10 h-10 bg-gray-500 rounded-lg flex flex-col items-center justify-center text-white shadow-sm">
                                <div className="text-[8px] font-medium leading-none">
                                  {format(event.start, 'MMM').toUpperCase()}
                                </div>
                                <div className="text-sm font-bold leading-none mt-0.5">
                                  {format(event.start, 'd')}
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground mt-1 text-center">
                                {getDatePrefix(event.start)}
                              </span>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm truncate">{event.title}</h4>
                                {event.transcriptionEnabled && (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                    🎙️ Transcribed
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground mb-1">
                                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {event.hangoutLink && (
                                  <span className="flex items-center gap-1">📹 Google Meet</span>
                                )}
                                {event.location && !event.hangoutLink && (
                                  <span className="flex items-center gap-1 truncate">
                                    📍 {event.location}
                                  </span>
                                )}
                                {event.attendees && event.attendees.length > 1 && (
                                  <span className="flex items-center gap-1">
                                    👥 {event.attendees.length} attendees
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* View Notes Button for previous meetings */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              // TODO: Navigate to meeting notes/transcript
                            }}
                            className="ml-2">
                            {event.transcriptionEnabled ? '📝 View Notes' : '👁️ View'}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <Card className="p-4 border-l-4 border-l-blue-500 bg-blue-50/50">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-lg">{selectedEvent.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {getDatePrefix(selectedEvent.start)} • {format(selectedEvent.start, 'h:mm a')} -{' '}
                  {format(selectedEvent.end, 'h:mm a')}
                </p>
                {selectedEvent.location && <p className="text-sm">📍 {selectedEvent.location}</p>}
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium mb-1">👥 Attendees:</p>
                    <p className="text-muted-foreground">
                      {selectedEvent.attendees.map((a) => a.displayName || a.email).join(', ')}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant={selectedEvent.transcriptionEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTranscription(selectedEvent.id)}>
                  {selectedEvent.transcriptionEnabled ? '🎙️ AI Enabled' : 'Enable AI'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                  ✕
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CalendarPage
