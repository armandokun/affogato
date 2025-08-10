import { Chip } from '@/components/ui/chip'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import ActionItemText from './action-item-text'

type Props = {
  id: string
  completed: boolean
  text: string
  assignee: {
    name: string
    avatarUrl?: string
  }
  onToggleItem: (id: string) => void
}

const ActionListItem = ({ id, completed, text, assignee, onToggleItem }: Props) => {
  return (
    <div key={id} className="flex items-center gap-3 group transition-colors rounded-md">
      <Checkbox checked={completed} onCheckedChange={() => onToggleItem(id)} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <ActionItemText text={text} completed={completed} />
          {assignee && (
            <Chip
              variant="outline"
              size="sm"
              className="text-muted-foreground border-muted bg-muted/20"
              prefix={
                <Avatar className="h-5 w-5">
                  {assignee.avatarUrl ? (
                    <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                  ) : (
                    <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                  )}
                </Avatar>
              }>
              {assignee.name}
            </Chip>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActionListItem
