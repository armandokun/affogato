import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', user.id)
      .order('meeting_start_time', { ascending: true })

    if (error) {
      console.error('Error fetching meetings:', error)

      return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 })
    }

    const meetings = (data || []).map((m) => ({
      id: m.id,
      calendar_event_id: m.calendar_event_id,
      meeting_title: m.meeting_title,
      meeting_start_time: m.meeting_start_time,
      meeting_end_time: m.meeting_end_time,
      meeting_url: m.meeting_url,
      calendar_event_url: m.calendar_event_url,
      transcription_enabled: m.recording_requested,
      status: 'scheduled',
      created_at: m.created_at,
      updated_at: m.updated_at
    }))

    return NextResponse.json({ meetings })
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
    const supabase = await createClient()

    const { calendarEventId, transcriptionEnabled } = body

    if (
      calendarEventId &&
      typeof transcriptionEnabled === 'boolean' &&
      Object.keys(body).length === 2
    ) {
      const { data, error } = await supabase
        .from('meetings')
        .update({
          recording_requested: transcriptionEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('calendar_event_id', calendarEventId)
        .select()

      if (error) {
        console.error('Error updating meeting recording_requested:', error)
        return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 })
      }

      return NextResponse.json({ meeting: data && data[0] })
    }

    const { data, error } = await supabase
      .from('meetings')
      .upsert(
        {
          user_id: user.id,
          calendar_event_id: body.calendarEventId,
          meeting_title: body.meetingTitle,
          meeting_start_time: body.meetingStartTime,
          meeting_end_time: body.meetingEndTime,
          meeting_url: body.meetingUrl,
          calendar_event_url: body.calendarEventUrl,
          recording_requested: body.transcriptionEnabled ?? true,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,calendar_event_id' }
      )
      .select()

    if (error) {
      console.error('Error saving meeting:', error)

      return NextResponse.json({ error: 'Failed to save meeting' }, { status: 500 })
    }

    const meeting =
      data && data[0]
        ? {
            id: data[0].id,
            calendar_event_id: data[0].calendar_event_id,
            meeting_title: data[0].meeting_title,
            meeting_start_time: data[0].meeting_start_time,
            meeting_end_time: data[0].meeting_end_time,
            meeting_url: data[0].meeting_url,
            calendar_event_url: data[0].calendar_event_url,
            transcription_enabled: data[0].recording_requested,
            status: 'scheduled',
            created_at: data[0].created_at,
            updated_at: data[0].updated_at
          }
        : null

    return NextResponse.json({ meeting })
  } catch (error) {
    console.error('Error saving meeting:', error)

    return NextResponse.json({ error: 'Failed to save meeting' }, { status: 500 })
  }
}
