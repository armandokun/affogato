import { NextResponse } from 'next/server'

import { getServerSession } from '@/lib/auth'
import { deleteIntegration } from '@/lib/db/queries'

export async function POST() {
  try {
    const user = await getServerSession()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    const success = await deleteIntegration({
      userId: user.id,
      provider: 'google_calendar'
    })

    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to disconnect Google Calendar' }), {
        status: 500
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error)
    return new Response(JSON.stringify({ error: 'Failed to disconnect Google Calendar' }), {
      status: 500
    })
  }
}
