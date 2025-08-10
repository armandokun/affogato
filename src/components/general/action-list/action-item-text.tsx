import { useState } from 'react'

const ActionItemText = ({ text, completed }: { text: string; completed: boolean }) => {
  const [focused, setFocused] = useState(false)

  return (
    <span
      contentEditable
      suppressContentEditableWarning
      className={`text-sm ${focused ? 'cursor-text' : 'cursor-pointer'} ${completed ? 'line-through text-muted-foreground' : 'text-foreground'} ${!focused ? 'hover:bg-primary/5 hover:transition-colors hover:px-1.5 hover:py-0.5 hover:-mx-1.5 hover:-my-0.5' : ''} rounded-sm`}
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
