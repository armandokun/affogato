'use client'

import Image from 'next/image'
import { format } from 'date-fns'
import { Bot, MessageSquare, MessageSquareText, X } from 'lucide-react'

import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'

import MeetingActionItems from './MeetingActionItems'

type ActionItem = {
  id: string
  text: string
  assignee?: string
  avatarUrl?: string
  completed: boolean
}

type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  hangoutLink?: string
  htmlLink?: string
  location?: string
  attendees?: Array<{ email: string; displayName: string; avatarUrl?: string }>
  transcriptionEnabled?: boolean
  summary?: string
  transcript?: string
  actionItems?: ActionItem[]
}

type MeetingDetailsModalProps = {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
}

const MeetingDetailsModal = ({ event, isOpen, onClose }: MeetingDetailsModalProps) => {
  if (!isOpen || !event) return null

  const handleToggleActionItem = (actionItemId: string) => {
    // TODO: Implement action item toggle logic
    console.log('Toggle action item:', actionItemId)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const ProfilePicture = ({
    name,
    avatarUrl,
    size = 'sm'
  }: {
    name: string
    avatarUrl?: string
    size?: 'xs' | 'sm' | 'md'
  }) => {
    const sizeClasses = {
      xs: 'w-3 h-3 text-[10px]',
      sm: 'w-4 h-4 text-xs',
      md: 'w-6 h-6 text-sm'
    }

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      )
    }
    return (
      <div
        className={`${sizeClasses[size]} bg-secondary/40 rounded-full flex items-center justify-center font-semibold`}>
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {format(event.start, 'EEEE, MMMM d, yyyy')} • {format(event.start, 'h:mm a')} -{' '}
              {format(event.end, 'h:mm a')}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-medium mb-3">Meeting Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>
                      {Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))}{' '}
                      minutes
                    </span>
                  </div>
                  {event.hangoutLink && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Platform:</span>
                      <Image
                        src="/integration-icons/google-meet.png"
                        alt="Google Meet"
                        width={16}
                        height={16}
                      />
                      <span>Google Meet</span>
                    </div>
                  )}
                  {event.location && !event.hangoutLink && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </Card>

              {event.attendees && event.attendees.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Attendees ({event.attendees.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.attendees.map((attendee, index) => (
                      <Chip
                        key={index}
                        variant="outline"
                        prefix={
                          <ProfilePicture
                            name={attendee.displayName || attendee.email}
                            avatarUrl={attendee.avatarUrl}
                            size="md"
                          />
                        }>
                        {attendee.displayName || attendee.email}
                      </Chip>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* AI Summary */}
            {event.summary && (
              <Card className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  AI Summary
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.summary}</p>
                </div>
              </Card>
            )}

            {/* Action Items */}
            {event.actionItems && event.actionItems.length > 0 && (
              <MeetingActionItems items={event.actionItems} />
            )}

            {/* Transcript */}
            {event.transcript && (
              <Card className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4 text-primary" />
                  Full Transcript
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                    {event.transcript}
                  </pre>
                </div>
              </Card>
            )}

            {!event.summary && !event.transcript && (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  <div className="w-12 h-12 mx-auto mb-3 bg-muted rounded-full flex items-center justify-center">
                    🤖
                  </div>
                  <p className="font-medium">Processing meeting data...</p>
                  <p className="text-sm mt-1">
                    AI summary and transcript will be available shortly.
                  </p>
                </div>
              </Card>
            )}

            {/* Chat with Meeting Button */}
            {(event.summary || event.transcript) && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Chat with this meeting
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ask questions about the discussion, get clarifications, or dive deeper into
                      specific topics.
                    </p>
                  </div>
                  <Button
                    className="ml-4 flex-shrink-0"
                    onClick={() => {
                      // TODO: Navigate to chat with meeting context
                      console.log('Start chat with meeting:', event.id)
                    }}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t bg-muted/20">
          {event.hangoutLink && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(event.hangoutLink, '_blank')}>
              Open in Google Meet
            </Button>
          )}
          {event.htmlLink && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(event.htmlLink, '_blank')}>
              View in Calendar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MeetingDetailsModal
