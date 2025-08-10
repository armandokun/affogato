// Google Calendar API client for fetching calendar events

import { google, calendar_v3 } from 'googleapis'
import { ensureValidGoogleToken } from '@/lib/db/queries'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  hangoutLink?: string
  htmlLink?: string
  location?: string
  description?: string
  attendees?: Array<{ email: string; displayName?: string }>
}

export class GoogleCalendarClient {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  private async getAuthenticatedClient() {
    const accessToken = await ensureValidGoogleToken(this.userId)

    if (!accessToken) {
      throw new Error('No valid Google token available')
    }

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    return google.calendar({ version: 'v3', auth: oauth2Client })
  }

  async getEvents(timeMin: Date, timeMax: Date): Promise<CalendarEvent[]> {
    try {
      const calendar = await this.getAuthenticatedClient()

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 100
      })

      const items = response.data.items || []

      return items
        .filter((event: calendar_v3.Schema$Event) => {
          // Only include events with Google Meet links or meeting locations
          return (
            event.hangoutLink ||
            event.location?.includes('meet.google.com') ||
            event.location?.includes('zoom.us') ||
            event.location?.includes('teams.microsoft.com')
          )
        })
        .map((event: calendar_v3.Schema$Event) => ({
          id: event.id!,
          title: event.summary || 'Untitled Meeting',
          start: new Date(event.start?.dateTime || event.start?.date || ''),
          end: new Date(event.end?.dateTime || event.end?.date || ''),
          hangoutLink: event.hangoutLink || undefined,
          htmlLink: event.htmlLink || undefined,
          location: event.location || undefined,
          description: event.description || undefined,
          attendees: event.attendees?.map((attendee: calendar_v3.Schema$EventAttendee) => ({
            email: attendee.email!,
            displayName: attendee.displayName || undefined
          }))
        }))
    } catch (error) {
      console.error('Failed to fetch calendar events:', error)
      throw new Error('Failed to fetch calendar events')
    }
  }

  async getEvent(eventId: string): Promise<CalendarEvent | null> {
    try {
      const calendar = await this.getAuthenticatedClient()

      const response = await calendar.events.get({
        calendarId: 'primary',
        eventId
      })

      const event = response.data

      return {
        id: event.id!,
        title: event.summary || 'Untitled Meeting',
        start: new Date(event.start?.dateTime || event.start?.date || ''),
        end: new Date(event.end?.dateTime || event.end?.date || ''),
        hangoutLink: event.hangoutLink || undefined,
        htmlLink: event.htmlLink || undefined,
        location: event.location || undefined,
        description: event.description || undefined,
        attendees: event.attendees?.map((attendee: calendar_v3.Schema$EventAttendee) => ({
          email: attendee.email!,
          displayName: attendee.displayName || undefined
        }))
      }
    } catch (error) {
      console.error('Failed to fetch calendar event:', error)
      return null
    }
  }
}
