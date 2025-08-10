'use client'

import { format } from 'date-fns'

import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  hangoutLink?: string
  htmlLink?: string
  location?: string
  attendees?: Array<{ email: string; displayName: string }>
  transcriptionEnabled?: boolean
}

type EventCardProps = {
  event: CalendarEvent
  type: 'upcoming' | 'previous'
  onToggleTranscription: (eventId: string, enabled: boolean) => void
  onClick: (event: CalendarEvent) => void
  getDatePrefix: (date: Date) => string
}

const EventCard = ({
  event,
  type,
  onToggleTranscription,
  onClick,
  getDatePrefix
}: EventCardProps) => {
  const isUpcoming = type === 'upcoming'

  const calendarIconBg = isUpcoming ? 'bg-black' : 'bg-gray-500'

  return (
    <div className="transition-shadow hover:shadow-md">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="flex flex-col items-center min-w-[60px] cursor-pointer"
              onClick={() => onClick(event)}>
              <div
                className={`w-10 h-10 ${calendarIconBg} rounded-lg flex flex-col items-center justify-center text-white shadow-sm`}>
                <div className="text-[8px] font-medium leading-none">
                  {format(event.start, 'MMM').toUpperCase()}
                </div>
                <div className="text-sm font-bold leading-none mt-0.5">
                  {format(event.start, 'd')}
                </div>
              </div>
              <span className="text-xs text-muted-foreground mt-1 text-center">
                {getDatePrefix(event.start)}
              </span>
            </div>

            {/* Event Details */}
            <div className="flex-1 min-w-0">
              {/* Title - Clickable */}
              <div className="flex items-center gap-2 mb-1">
                <h4
                  className="font-semibold text-sm truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onClick(event)}>
                  {event.title}
                </h4>
                {!isUpcoming && event.transcriptionEnabled && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    🎙️ Transcribed
                  </span>
                )}
              </div>

              {/* Time - Clickable */}
              <div className="mb-1">
                <span
                  className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onClick(event)}>
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </span>
              </div>

              {/* Meeting info - Not clickable */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {event.hangoutLink && (
                  <span 
                    className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(event.hangoutLink, '_blank')
                    }}>
                    📹 Google Meet
                  </span>
                )}
                {event.location && !event.hangoutLink && (
                  <span className="flex items-center gap-1 truncate">📍 {event.location}</span>
                )}
                {event.attendees && event.attendees.length > 1 && (
                  <span className="flex items-center gap-1">
                    👥 {event.attendees.length} attendees
                  </span>
                )}
              </div>
            </div>
          </div>

          {isUpcoming ? (
            <div onClick={(e) => e.stopPropagation()} className="ml-2 flex items-center">
              <Switch
                checked={event.transcriptionEnabled}
                onCheckedChange={(checked) => onToggleTranscription(event.id, checked)}
                className="cursor-pointer"
              />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Navigate to meeting notes/transcript
              }}
              className="ml-2">
              {event.transcriptionEnabled ? '📝 View Notes' : '👁️ View'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default EventCard
