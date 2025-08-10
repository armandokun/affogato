import { useState } from 'react'
import { ListTodo } from 'lucide-react'

import Card from '@/components/ui/card'

import ActionListItem from './action-list-item'

type ActionItem = {
  id: string
  text: string
  completed: boolean
  assignee?: string
  avatarUrl?: string
  mine?: boolean
}

interface MeetingActionItemsProps {
  items: ActionItem[]
}

const MeetingActionItems = ({ items: initialItems }: MeetingActionItemsProps) => {
  const [items, setItems] = useState(initialItems)

  const handleToggleActionItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const myItems = items.filter((item) => item.mine)
  const otherItems = items.filter((item) => !item.mine)

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <ListTodo className="h-4 w-4 text-primary" />
        Action Items ({items.length})
      </h3>
      <div className="space-y-4">
        {myItems.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-primary mb-3">Assigned to me</h4>
            <div className="space-y-3">
              {myItems.map((item) => {
                return (
                  <ActionListItem
                    key={item.id}
                    id={item.id}
                    completed={item.completed}
                    text={item.text}
                    assignee={{
                      name: item.assignee || '',
                      avatarUrl: item.avatarUrl
                    }}
                    onToggleItem={handleToggleActionItem}
                  />
                )
              })}
            </div>
          </div>
        )}
        {otherItems.length > 0 && (
          <div>
            {myItems.length > 0 && (
              <div className="flex items-center gap-2 mb-3 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Other team members ({otherItems.length})
                </h4>
              </div>
            )}
            <div className="space-y-3">
              {otherItems.map((item) => {
                return (
                  <ActionListItem
                    key={item.id}
                    id={item.id}
                    completed={item.completed}
                    text={item.text}
                    assignee={{
                      name: item.assignee || '',
                      avatarUrl: item.avatarUrl
                    }}
                    onToggleItem={handleToggleActionItem}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default MeetingActionItems
