import { useState } from 'react'

const ActionItemText = ({ text, completed }: { text: string; completed: boolean }) => {
  const [focused, setFocused] = useState(false)

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      className={`text-sm ${focused ? 'cursor-text' : 'cursor-pointer'} ${completed ? 'line-through text-muted-foreground' : 'text-foreground'} ${!focused ? 'group-hover:bg-primary/5 group-hover:transition-colors group-hover:px-1.5 group-hover:py-0.5 group-hover:-mx-1.5 group-hover:-my-0.5' : ''} rounded-sm`}
      style={{ outline: 'none', border: 'none' }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          ;(e.target as HTMLElement).blur()
        }
      }}>
      {text}
    </span>
  )
}

export default ActionItemText
