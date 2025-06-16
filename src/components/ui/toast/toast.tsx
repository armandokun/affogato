'use client'

import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { toast as sonnerToast } from 'sonner'

import { cn } from '@/lib/utils'

type Props = {
  id: string | number
  type: 'success' | 'error'
  description: string
}

const iconsByType: Record<'success' | 'error', ReactNode> = {
  success: <CheckCircle />,
  error: <AlertCircle />
}

function Toast(props: Props) {
  const { id, type, description } = props

  const descriptionRef = useRef<HTMLDivElement>(null)
  const [multiLine, setMultiLine] = useState(false)

  useEffect(() => {
    const el = descriptionRef.current
    if (!el) return

    const update = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight)
      const lines = Math.round(el.scrollHeight / lineHeight)
      setMultiLine(lines > 1)
    }

    update() // initial check
    const ro = new ResizeObserver(update) // re-check on width changes
    ro.observe(el)

    return () => ro.disconnect()
  }, [description])

  return (
    <div className="flex w-full toast-mobile:w-[356px] justify-center">
      <div
        data-testid="toast"
        key={id}
        className={cn(
          'bg-black border border-zinc-800 shadow-lg p-4 rounded-lg w-full toast-mobile:w-fit flex flex-row gap-3',
          multiLine ? 'items-start' : 'items-center'
        )}>
        <div
          data-type={type}
          className={cn('pt-1', type === 'error' ? 'text-red-400' : 'text-green-400')}>
          {iconsByType[type]}
        </div>
        <div ref={descriptionRef} className="text-zinc-100 text-sm">
          {description}
        </div>
      </div>
    </div>
  )
}

export function toast(props: Omit<Props, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast id={id} type={props.type} description={props.description} />
  ))
}
