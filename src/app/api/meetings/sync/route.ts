import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { GoogleCalendarClient } from '@/lib/google-calendar/client'

export async function POST() {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const client = new GoogleCalendarClient(user.id)
      const now = new Date()
      const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

      const events = await client.getEvents(pastDate, futureDate)
      console.log(`Fetched ${events.length} calendar events for user ${user.id}`)

      return NextResponse.json({ events })
    } catch (calendarError) {
      console.error('Failed to fetch Google Calendar events:', calendarError)

      // Fall back to mock data if Google Calendar fails
      const mockEvents = [
        // Previous meetings
        {
          id: 'event-past-1',
          title: 'Weekly Sync (Last Week)',
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 mins
          hangoutLink: 'https://meet.google.com/past-meeting-1',
          location: 'Google Meet',
          attendees: [
            { email: 'user@example.com', displayName: 'User' },
            { email: 'colleague@example.com', displayName: 'Colleague' }
          ]
        },
        {
          id: 'event-past-2',
          title: 'Project Kickoff',
          start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          end: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
          hangoutLink: 'https://meet.google.com/past-meeting-2',
          location: 'Google Meet',
          attendees: [
            { email: 'user@example.com', displayName: 'User' },
            { email: 'pm@example.com', displayName: 'Project Manager' },
            { email: 'dev@example.com', displayName: 'Developer' }
          ]
        },
        // Upcoming meetings
        {
          id: 'event-1',
          title: 'Team Standup',
          start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 mins
          hangoutLink: 'https://meet.google.com/abc-defg-hij',
          location: 'Google Meet',
          attendees: [
            { email: 'user@example.com', displayName: 'User' },
            { email: 'teammate@example.com', displayName: 'Teammate' }
          ]
        },
        {
          id: 'event-2',
          title: 'Product Review',
          start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
          hangoutLink: 'https://meet.google.com/xyz-uvwx-yz',
          location: 'Google Meet',
          attendees: [
            { email: 'user@example.com', displayName: 'User' },
            { email: 'product@example.com', displayName: 'Product Manager' }
          ]
        },
        {
          id: 'event-3',
          title: 'Client Call',
          start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // +45 mins
          location: 'https://zoom.us/j/1234567890',
          attendees: [
            { email: 'user@example.com', displayName: 'User' },
            { email: 'client@example.com', displayName: 'Client' }
          ]
        }
      ]

      console.log(`Fallback: Using ${mockEvents.length} mock calendar events for user ${user.id}`)
      return NextResponse.json({ events: mockEvents })
    }
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json({ error: 'Failed to sync calendar' }, { status: 500 })
  }
}
