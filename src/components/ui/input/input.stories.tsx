import React, { useState } from 'react'
import Input from './input'

const meta = {
  title: 'UI/Input',
  component: Input
}

export default meta

export const Basic = () => <Input placeholder="Type here..." />

export const Controlled = () => {
  const [value, setValue] = useState('')
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Controlled input..."
    />
  )
}
