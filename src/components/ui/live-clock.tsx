"use client"

import { useState, useEffect } from "react"

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!time) {
    return (
      <div className="text-sm text-muted-foreground">
        <div>--/--/----</div>
        <div className="font-mono">--:--:-- --</div>
      </div>
    )
  }

  return (
    <div className="text-sm text-muted-foreground">
      <div>{time.toLocaleDateString()}</div>
      <div className="font-mono">{time.toLocaleTimeString()}</div>
    </div>
  )
}