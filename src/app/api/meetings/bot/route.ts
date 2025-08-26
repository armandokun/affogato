import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { recallClient } from '@/lib/recall/client'

export async function POST(request: Request) {
  try {
    // Check if this is a cron job request
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'supabase-cron'
    const isCronJob = authHeader === `Bearer ${cronSecret}`

    console.log('🤖 Bot API called:', {
      authHeader: authHeader ? `Bearer ${authHeader.slice(-10)}...` : 'none',
      cronSecret: cronSecret ? `${cronSecret.slice(0, 10)}...` : 'none',
      isCronJob,
      env: process.env.NODE_ENV
    })

    let userId: string | null = null

    if (isCronJob) {
      console.log('✅ Cron job authenticated')
      // For cron jobs, we'll get the user_id from the meeting data
      // No user session needed
    } else {
      console.log('🔐 Checking user session')
      // For regular API calls, require user session
      const user = await getServerSession()
      if (!user) {
        console.log('❌ No user session found')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userId = user.id
      console.log('✅ User authenticated:', userId)
    }

    const body = await request.json()
    const { calendarEventId, action } = body

    console.log('📝 Request body:', { calendarEventId, action })

    if (!calendarEventId) {
      return NextResponse.json({ error: 'Calendar event ID is required' }, { status: 400 })
    }

    // Use service role for cron jobs to bypass RLS
    const supabase = isCronJob
      ? await createClient(process.env.SUPABASE_SERVICE_ROLE_KEY) // Service role bypasses RLS
      : await createClient() // Regular client for user sessions

    console.log('🔍 Querying meeting:', { calendarEventId, isCronJob, userId })

    // Get the meeting details
    let meetingQuery = supabase
      .from('meetings')
      .select('*')
      .eq('calendar_event_id', calendarEventId)

    // For non-cron requests, filter by user_id
    if (!isCronJob && userId) {
      console.log('🔒 Adding user_id filter:', userId)
      meetingQuery = meetingQuery.eq('user_id', userId)
    }

    const { data: meeting, error: meetingError } = await meetingQuery.single()

    console.log('📊 Database result:', {
      found: !!meeting,
      error: meetingError?.message || null,
      meetingId: meeting?.id || null,
      meetingTitle: meeting?.meeting_title || null
    })

    if (meetingError || !meeting) {
      console.log('❌ Meeting not found:', meetingError)
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    if (!meeting.meeting_url) {
      return NextResponse.json(
        { error: 'Meeting URL is required to start recording' },
        { status: 400 }
      )
    }

    if (action === 'start') {
      // Check if bot is already active for this meeting
      if (meeting.recall_bot_id && meeting.recording_status === 'active') {
        return NextResponse.json(
          { error: 'Recording is already active for this meeting' },
          { status: 400 }
        )
      }

      try {
        console.log('🤖 Creating Recall.ai bot:', {
          meeting_url: meeting.meeting_url,
          meeting_title: meeting.meeting_title
        })

        // Create bot with Recall.ai
        const botResponse = await recallClient.createBot({
          meeting_url: meeting.meeting_url,
          bot_name: `Affogato Assistant - ${meeting.meeting_title}`,
          recording_mode: 'speaker_view',
          transcription_options: {
            provider: 'deepgram'
          }
        })

        console.log('✅ Bot created:', { botId: botResponse.id })

        // Update meeting with bot ID and status
        let updateQuery = supabase
          .from('meetings')
          .update({
            recall_bot_id: botResponse.id,
            recording_status: 'joining',
            bot_started_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('calendar_event_id', calendarEventId)

        // For non-cron requests, also filter by user_id (cron uses service role, no need to filter)
        if (!isCronJob && userId) {
          updateQuery = updateQuery.eq('user_id', userId)
        }

        const { data: updatedMeeting, error: updateError } = await updateQuery.select().single()

        console.log('💾 Database update result:', {
          success: !updateError,
          error: updateError?.message || null,
          botId: botResponse.id
        })

        if (updateError) {
          console.error('❌ Error updating meeting with bot info:', updateError)
          // Try to cleanup the bot if database update failed
          try {
            await recallClient.deleteBot(botResponse.id)
          } catch (cleanupError) {
            console.error('Failed to cleanup bot after database error:', cleanupError)
          }
          return NextResponse.json({ error: 'Failed to update meeting status' }, { status: 500 })
        }

        return NextResponse.json({
          message: 'Bot started successfully',
          botId: botResponse.id,
          meeting: updatedMeeting
        })
      } catch (recallError) {
        console.error('Recall API error:', recallError)
        return NextResponse.json({ error: 'Failed to start recording bot' }, { status: 500 })
      }
    } else if (action === 'stop') {
      if (!meeting.recall_bot_id) {
        return NextResponse.json({ error: 'No active bot found for this meeting' }, { status: 400 })
      }

      try {
        // Delete bot from Recall.ai
        await recallClient.deleteBot(meeting.recall_bot_id)

        // Update meeting status
        let stopUpdateQuery = supabase
          .from('meetings')
          .update({
            recording_status: 'stopped',
            bot_ended_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('calendar_event_id', calendarEventId)

        // For non-cron requests, also filter by user_id (cron uses service role, no need to filter)
        if (!isCronJob && userId) {
          stopUpdateQuery = stopUpdateQuery.eq('user_id', userId)
        }

        const { data: updatedMeeting, error: updateError } = await stopUpdateQuery.select().single()

        if (updateError) {
          console.error('Error updating meeting status:', updateError)
          return NextResponse.json({ error: 'Failed to update meeting status' }, { status: 500 })
        }

        return NextResponse.json({
          message: 'Bot stopped successfully',
          meeting: updatedMeeting
        })
      } catch (recallError) {
        console.error('Error stopping bot:', recallError)
        return NextResponse.json({ error: 'Failed to stop recording bot' }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: 'Invalid action. Use "start" or "stop"' }, { status: 400 })
    }
  } catch (error) {
    console.error('Bot management error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Check if this is a cron job request
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'supabase-cron'
    const isCronJob = authHeader === `Bearer ${cronSecret}`

    let userId: string | null = null

    if (isCronJob) {
      // For cron jobs, no user session needed
    } else {
      // For regular API calls, require user session
      const user = await getServerSession()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userId = user.id
    }

    const { searchParams } = new URL(request.url)
    const calendarEventId = searchParams.get('calendarEventId')

    if (!calendarEventId) {
      return NextResponse.json({ error: 'Calendar event ID is required' }, { status: 400 })
    }

    // Use service role for cron jobs to bypass RLS
    const supabase = isCronJob
      ? await createClient(process.env.SUPABASE_SERVICE_ROLE_KEY) // Service role bypasses RLS
      : await createClient() // Regular client for user sessions

    // Get meeting with bot info
    let getMeetingQuery = supabase
      .from('meetings')
      .select('*')
      .eq('calendar_event_id', calendarEventId)

    // For non-cron requests, filter by user_id
    if (!isCronJob && userId) {
      getMeetingQuery = getMeetingQuery.eq('user_id', userId)
    }

    const { data: meeting, error } = await getMeetingQuery.single()

    if (error || !meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    // If there's an active bot, get its current status from Recall.ai
    if (meeting.recall_bot_id && meeting.recording_status === 'active') {
      try {
        const botStatus = await recallClient.getBot(meeting.recall_bot_id)

        // Update local status if it's different
        if (botStatus.status !== meeting.recording_status) {
          let statusUpdateQuery = supabase
            .from('meetings')
            .update({
              recording_status: botStatus.status,
              updated_at: new Date().toISOString()
            })
            .eq('calendar_event_id', calendarEventId)

          // For non-cron requests, also filter by user_id (cron uses service role, no need to filter)
          if (!isCronJob && userId) {
            statusUpdateQuery = statusUpdateQuery.eq('user_id', userId)
          }

          await statusUpdateQuery
        }

        return NextResponse.json({
          meeting,
          botStatus: {
            id: botStatus.id,
            status: botStatus.status,
            recording_started_at: botStatus.recording_started_at,
            video_url: botStatus.video_url
          }
        })
      } catch (recallError) {
        console.error('Error fetching bot status:', recallError)
        // Return meeting data without bot status if Recall API fails
      }
    }

    return NextResponse.json({ meeting })
  } catch (error) {
    console.error('Error fetching bot status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
