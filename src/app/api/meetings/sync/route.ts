import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { GoogleCalendarClient } from '@/lib/google-calendar/client'

export async function POST() {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For development/testing: always return mock data instead of real Google Calendar
    const mockEvents = [
      // Previous meetings
      {
        id: 'event-past-1',
        title: 'Weekly Sync (Last Week)',
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 mins
        hangoutLink: 'https://meet.google.com/past-meeting-1',
        htmlLink: 'https://calendar.google.com/calendar/event?eid=mock1',
        location: 'Google Meet',
        attendees: [
          {
            email: 'user@example.com',
            displayName: 'Sarah Chen',
            avatarUrl: '/testimonial-profile-images/armandas.jpg'
          },
          {
            email: 'colleague@example.com',
            displayName: 'Mike Johnson',
            avatarUrl: '/testimonial-profile-images/ignas.jpg'
          },
          {
            email: 'john@example.com',
            displayName: 'John Smith',
            avatarUrl: '/testimonial-profile-images/rokas.png'
          }
        ],
        transcriptionEnabled: true,
        summary:
          'In this weekly sync, we discussed the current project status and upcoming milestones. The team reviewed completed tasks from last week, including the user authentication system and database schema updates. We identified three key action items: finalizing the API documentation, conducting user testing sessions, and preparing for the upcoming product demo. The discussion also covered resource allocation for the next sprint and potential blockers that might impact our timeline.',
        actionItems: [
          {
            id: 'action-1',
            text: 'Finalize the API documentation by Friday',
            assignee: 'Sarah Chen',
            completed: true
          },
          {
            id: 'action-2',
            text: 'Schedule and conduct user testing sessions with 5 participants',
            assignee: 'Mike Johnson',
            completed: false
          },
          {
            id: 'action-3',
            text: 'Prepare demo slides and test environment for product demo',
            assignee: 'John Smith',
            completed: false
          },
          {
            id: 'action-4',
            text: 'Coordinate with design team for login flow UI updates',
            assignee: 'Mike Johnson',
            completed: true
          },
          {
            id: 'action-5',
            text: 'Review security audit results and address any findings',
            assignee: 'Sarah Chen',
            completed: false
          }
        ],
        transcript: `[00:00] John: Good morning everyone, let's start our weekly sync.

[00:02] Sarah: Hi everyone! Ready to review last week's progress.

[00:05] John: Great, let's start with Sarah. How did the authentication system go?

[00:08] Sarah: It went really well. I completed the OAuth integration and all tests are passing. The security review is scheduled for tomorrow.

[00:15] Mike: That's awesome Sarah. On my end, the database schema is fully updated. All migrations have been tested in staging.

[00:22] John: Perfect. Any blockers we should discuss?

[00:25] Sarah: Just one small thing - we might need to coordinate with the design team for the login flow UI updates.

[00:30] Mike: I can reach out to the design team today to schedule that.

[00:33] John: Sounds good. Let's move to next week's priorities...`
      },
      {
        id: 'event-past-2',
        title: 'Project Kickoff',
        start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        end: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
        hangoutLink: 'https://meet.google.com/past-meeting-2',
        htmlLink: 'https://calendar.google.com/calendar/event?eid=mock2',
        location: 'Google Meet',
        attendees: [
          { email: 'user@example.com', displayName: 'User' },
          { email: 'pm@example.com', displayName: 'Project Manager' },
          { email: 'dev@example.com', displayName: 'Developer' }
        ],
        transcriptionEnabled: false
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

    return NextResponse.json({ events: mockEvents })
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json({ error: 'Failed to sync calendar' }, { status: 500 })
  }
}
