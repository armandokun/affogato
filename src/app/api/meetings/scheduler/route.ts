import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { recallClient } from '@/lib/recall/client'

/**
 * Scheduled endpoint to automatically start recording bots for meetings
 * This should be called by a cron job every few minutes before meetings start
 */
export async function POST(request: Request) {
  try {
    // Verify this is called by authorized service (e.g., cron job)
    const authHeader = request.headers.get('authorization')
    const cronSecret = request.headers.get('x-vercel-cron-secret')
    const expectedToken = process.env.CRON_SECRET || 'supabase-cron'

    // Allow Vercel cron jobs, Supabase cron jobs, or manual calls with Bearer token
    const isVercelCron = cronSecret && process.env.NODE_ENV === 'production'
    const isSupabaseCron = authHeader === `Bearer ${expectedToken}`
    const isManualCall = authHeader && authHeader.startsWith('Bearer ')

    if (!isVercelCron && !isSupabaseCron && !isManualCall) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

    // Find meetings that:
    // 1. Have recording_requested = true
    // 2. Start within the next 5 minutes
    // 3. Don't already have an active bot
    // 4. Have a meeting URL
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('recording_requested', true)
      .is('recall_bot_id', null)
      .gte('meeting_start_time', now.toISOString())
      .lte('meeting_start_time', fiveMinutesFromNow.toISOString())
      .not('meeting_url', 'is', null)

    if (error) {
      console.error('Error fetching meetings for scheduling:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!meetings || meetings.length === 0) {
      return NextResponse.json({
        message: 'No meetings to schedule',
        processed: 0
      })
    }

    console.log(`Found ${meetings.length} meetings to schedule bots for`)

    const results = []

    for (const meeting of meetings) {
      try {
        console.log(`Starting bot for meeting: ${meeting.meeting_title}`)

        // Create bot with Recall.ai
        const botResponse = await recallClient.createBot({
          meeting_url: meeting.meeting_url,
          bot_name: `Affogato Assistant - ${meeting.meeting_title}`,
          recording_mode: 'speaker_view',
          transcription_options: {
            provider: 'deepgram'
          }
        })

        // Update meeting with bot info
        const { error: updateError } = await supabase
          .from('meetings')
          .update({
            recall_bot_id: botResponse.id,
            recording_status: 'joining',
            bot_started_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', meeting.id)

        if (updateError) {
          console.error(`Error updating meeting ${meeting.id}:`, updateError)
          // Try to cleanup the bot
          try {
            await recallClient.deleteBot(botResponse.id)
          } catch (cleanupError) {
            console.error('Failed to cleanup bot:', cleanupError)
          }
          results.push({
            meetingId: meeting.id,
            status: 'error',
            error: 'Database update failed'
          })
        } else {
          results.push({
            meetingId: meeting.id,
            botId: botResponse.id,
            status: 'scheduled'
          })
          console.log(`Successfully scheduled bot ${botResponse.id} for meeting ${meeting.id}`)
        }
      } catch (botError) {
        console.error(`Error creating bot for meeting ${meeting.id}:`, botError)
        results.push({
          meetingId: meeting.id,
          status: 'error',
          error: botError instanceof Error ? botError.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter((r) => r.status === 'scheduled').length
    const errorCount = results.filter((r) => r.status === 'error').length

    console.log(`Scheduling complete: ${successCount} successful, ${errorCount} errors`)

    return NextResponse.json({
      message: 'Scheduling complete',
      processed: meetings.length,
      successful: successCount,
      errors: errorCount,
      results
    })
  } catch (error) {
    console.error('Scheduler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET endpoint to check upcoming meetings that need bots
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = request.headers.get('x-vercel-cron-secret')
    const expectedToken = process.env.CRON_SECRET || 'supabase-cron'

    // Allow Vercel cron jobs, Supabase cron jobs, or manual calls with Bearer token
    const isVercelCron = cronSecret && process.env.NODE_ENV === 'production'
    const isSupabaseCron = authHeader === `Bearer ${expectedToken}`
    const isManualCall = authHeader && authHeader.startsWith('Bearer ')

    if (!isVercelCron && !isSupabaseCron && !isManualCall) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const now = new Date()
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

    // Get meetings that need bots in the next hour
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select(
        'id, meeting_title, meeting_start_time, recording_requested, recall_bot_id, recording_status'
      )
      .eq('recording_requested', true)
      .gte('meeting_start_time', now.toISOString())
      .lte('meeting_start_time', oneHourFromNow.toISOString())
      .order('meeting_start_time')

    if (error) {
      console.error('Error fetching upcoming meetings:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({
      upcoming_meetings: meetings || [],
      count: meetings?.length || 0
    })
  } catch (error) {
    console.error('Error checking upcoming meetings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
