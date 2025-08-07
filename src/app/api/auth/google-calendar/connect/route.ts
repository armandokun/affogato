import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getGoogleAuthUrl } from '@/lib/google-calendar/oauth'

export async function GET() {
  try {
    const user = await getServerSession()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authUrl = getGoogleAuthUrl(user.id)
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Google Calendar connect error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Google Calendar connection' },
      { status: 500 }
    )
  }
}
