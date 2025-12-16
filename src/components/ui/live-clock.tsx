"use client"

import { useState, useEffect } from "react"

interface LiveClockProps {
  className?: string
}

export function LiveClock({ className }: LiveClockProps) {
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className={`text-sm text-muted-foreground ${className || ''}`}>
        <div>--/--/----</div>
        <div className="font-mono">--:--:-- --</div>
      </div>
    )
  }

  return (
    <div className={`text-sm text-muted-foreground ${className || ''}`}>
      <div>{time.toLocaleDateString()}</div>
      <div className="font-mono">{time.toLocaleTimeString()}</div>
    </div>
  )
}