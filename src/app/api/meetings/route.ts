import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock data for now - replace with database call later
    const mockMeetings = [
      {
        id: '1',
        calendar_event_id: 'mock-event-1',
        meeting_title: 'Team Standup',
        meeting_start_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        meeting_end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // +30 mins
        meeting_url: 'https://meet.google.com/abc-defg-hij',
        transcription_enabled: true,
        status: 'scheduled'
      },
      {
        id: '2',
        calendar_event_id: 'mock-event-2',
        meeting_title: 'Product Review',
        meeting_start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        meeting_end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1 hour
        meeting_url: 'https://meet.google.com/xyz-uvwx-yz',
        transcription_enabled: false,
        status: 'scheduled'
      }
    ]

    return NextResponse.json({ meetings: mockMeetings })
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Mock response for now - replace with database call later
    const mockMeeting = {
      id: Date.now().toString(),
      user_id: user.id,
      calendar_event_id: body.calendarEventId,
      meeting_title: body.meetingTitle,
      meeting_start_time: body.meetingStartTime,
      meeting_end_time: body.meetingEndTime,
      meeting_url: body.meetingUrl,
      transcription_enabled: body.transcriptionEnabled ?? true,
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Mock meeting saved:', mockMeeting)

    return NextResponse.json({ meeting: mockMeeting })
  } catch (error) {
    console.error('Error saving meeting:', error)
    return NextResponse.json({ error: 'Failed to save meeting' }, { status: 500 })
  }
}
