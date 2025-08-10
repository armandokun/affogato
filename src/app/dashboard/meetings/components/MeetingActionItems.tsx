import React from 'react'
import { CheckCircle } from 'lucide-react'

import Card from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Chip } from '@/components/ui/chip'

type ActionItem = {
  id: string
  text: string
  assignee?: string
  avatarUrl?: string
  completed: boolean
}

type MeetingActionItemsProps = {
  actionItems: ActionItem[]
}

const MeetingActionItems: React.FC<MeetingActionItemsProps> = ({ actionItems }) => {
  // TODO: Get current user from session/context
  const currentUserName = 'Sarah Chen' // Mock current user

  // Mock avatar mapping - in real app this would come from user data
  const avatarMap: { [key: string]: string } = {
    'Sarah Chen': '/testimonial-profile-images/armandas.jpg',
    'Mike Johnson': '/testimonial-profile-images/ignas.jpg',
    'John Smith': '/testimonial-profile-images/lukas.jpg'
  }

  const enhancedItems = actionItems.map((item) => ({
    ...item,
    avatarUrl: item.assignee ? avatarMap[item.assignee] : undefined
  }))

  const myItems = enhancedItems.filter((item) => item.assignee === currentUserName)
  const otherItems = enhancedItems.filter((item) => item.assignee !== currentUserName)

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
    <Card className="p-4">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-primary" />
        Action Items ({actionItems.length})
      </h3>
      <div className="space-y-4">
        {/* My Action Items */}
        {myItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <h4 className="text-sm font-medium text-primary">
                Assigned to me ({myItems.length})
              </h4>
            </div>
            <div className="space-y-3 pl-4 border-l-2 border-primary/20">
              {myItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 group">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleActionItem(item.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm ${
                          item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                        {item.text}
                      </span>
                      {item.assignee && (
                        <Chip
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary/20 bg-primary/5"
                          prefix={
                            <ProfilePicture
                              name={item.assignee}
                              avatarUrl={item.avatarUrl}
                              size="xs"
                            />
                          }>
                          {item.assignee}
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Action Items */}
        {otherItems.length > 0 && (
          <div>
            {myItems.length > 0 && (
              <div className="flex items-center gap-2 mb-3 mt-4">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
                <h4 className="text-sm font-medium text-muted-foreground">
                  Other team members ({otherItems.length})
                </h4>
              </div>
            )}
            <div
              className={`space-y-3 ${myItems.length > 0 ? 'pl-4 border-l-2 border-muted/30' : ''}`}>
              {otherItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 group">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleActionItem(item.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm ${
                          item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                        {item.text}
                      </span>
                      {item.assignee && (
                        <Chip
                          variant="outline"
                          size="sm"
                          className="text-muted-foreground border-muted bg-muted/20"
                          prefix={
                            <ProfilePicture
                              name={item.assignee}
                              avatarUrl={item.avatarUrl}
                              size="xs"
                            />
                          }>
                          {item.assignee}
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default MeetingActionItems
