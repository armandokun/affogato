import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getOAuthTokensFromProvider } from '@/lib/db/queries'

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tokens = await getOAuthTokensFromProvider({
      userId: user.id,
      provider: 'google_calendar'
    })

    if (tokens && tokens.accessToken) {
      return NextResponse.json({
        connected: true,
        email: 'Connected to Google Calendar'
      })
    } else {
      return NextResponse.json({
        connected: false
      })
    }
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({
      connected: false
    })
  }
}
