'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const PromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isVisible, setIsVisible] = useState(true)
  const [targetTime] = useState(() => {
    // Set target time to tomorrow at 22:59:59 EET (UTC+2)
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(22, 59, 59, 999) // 22:59:59 local time

    // Convert to EET (UTC+2) - adjust for timezone difference
    const eetOffset = 3 * 60 // EET is UTC+2
    const localOffset = now.getTimezoneOffset() // Local timezone offset in minutes from UTC
    const offsetDifference = (eetOffset + localOffset) * 60 * 1000 // Convert to milliseconds

    return new Date(tomorrow.getTime() - offsetDifference)
  })

  useEffect(() => {
    // Calculate time until tomorrow 19:00 EET
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetTime.getTime() - now.getTime()

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="relative w-full bg-[#2979FF] text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-center text-center relative">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>🎉</span>
          <span>GET 50% OFF SUBSCRIBING NOW |</span>
          <span>ENDS IN:</span>
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded font-mono">
            <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span>:</span>
            <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Close banner">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default PromoBanner
