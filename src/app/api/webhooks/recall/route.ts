import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RecallWebhookEvent {
  event: string
  data: {
    bot_id: string
    meeting_url: string
    status: string
    recording_started_at?: string
    recording_ended_at?: string
    video_url?: string
    transcript_url?: string
    status_changes: Array<{
      code: string
      message: string
      created_at: string
    }>
  }
}

export async function POST(request: Request) {
  try {
    // TODO: Add webhook signature verification for security
    // const signature = request.headers.get('recall-signature')
    // if (!verifyWebhookSignature(signature, body)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    const event: RecallWebhookEvent = await request.json()
    console.log('Received Recall webhook:', event)

    if (event.event !== 'bot.status_change') {
      console.log('Ignoring non-status webhook:', event.event)
      return NextResponse.json({ message: 'Event ignored' })
    }

    const { bot_id, status, recording_started_at, recording_ended_at, video_url, transcript_url } =
      event.data

    const supabase = await createClient()

    // Find the meeting by bot_id
    const { data: meeting, error: findError } = await supabase
      .from('meetings')
      .select('*')
      .eq('recall_bot_id', bot_id)
      .single()

    if (findError || !meeting) {
      console.error('Meeting not found for bot_id:', bot_id, findError)
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      recording_status: status,
      updated_at: new Date().toISOString()
    }

    // Add timestamps if provided
    if (recording_started_at) {
      updateData.recording_started_at = recording_started_at
    }
    if (recording_ended_at) {
      updateData.bot_ended_at = recording_ended_at
    }
    if (video_url) {
      updateData.recording_url = video_url
    }
    if (transcript_url) {
      updateData.transcription_url = transcript_url
    }

    // Update the meeting with new status
    const { error: updateError } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('recall_bot_id', bot_id)

    if (updateError) {
      console.error('Error updating meeting status:', updateError)
      return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 })
    }

    console.log(`Updated meeting ${meeting.calendar_event_id} with status: ${status}`)

    // Handle specific status changes
    switch (status) {
      case 'done':
        console.log(`Recording completed for meeting: ${meeting.meeting_title}`)
        // TODO: Trigger post-processing (e.g., transcription analysis, notifications)
        break
      case 'error':
        console.error(`Bot error for meeting: ${meeting.meeting_title}`)
        // TODO: Send error notification to user
        break
      case 'recording':
        console.log(`Recording started for meeting: ${meeting.meeting_title}`)
        break
    }

    return NextResponse.json({ message: 'Webhook processed successfully' })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, recall-signature'
    }
  })
}



