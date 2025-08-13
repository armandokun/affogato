import { NextResponse } from 'next/server'

import { getServerSession } from '@/lib/auth'
import { GoogleCalendarClient } from '@/lib/google-calendar/client'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch real events from Google Calendar (last 30 days to next 30 days)
    const now = new Date()
    const timeMin = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const calendarClient = new GoogleCalendarClient(user.id)
    const events = await calendarClient.getEvents(timeMin, timeMax)

    const supabase = await createClient()

    // Fetch existing meetings to preserve recording_requested
    const { data: existingMeetings } = await supabase
      .from('meetings')
      .select('calendar_event_id, recording_requested')
      .eq('user_id', user.id)

    const recordingMap = new Map(
      (existingMeetings || []).map((m) => [m.calendar_event_id, m.recording_requested])
    )

    const upsertData = events.map((event) => ({
      user_id: user.id,
      calendar_event_id: event.id,
      meeting_title: event.title,
      meeting_start_time: event.start,
      meeting_end_time: event.end,
      meeting_url: event.hangoutLink,
      calendar_event_url: event.htmlLink,
      recording_requested: recordingMap.has(event.id) ? recordingMap.get(event.id) : false,
      updated_at: new Date().toISOString()
    }))

    if (upsertData.length > 0) {
      await supabase
        .from('meetings')
        .upsert(upsertData, { onConflict: 'user_id,calendar_event_id' })
    }

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Calendar sync error:', error)
    return NextResponse.json({ error: 'Failed to sync calendar' }, { status: 500 })
  }
}
