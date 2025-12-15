"use client"

import { useState, useEffect } from "react"

export function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-sm text-muted-foreground">
      <div>{time.toLocaleDateString()}</div>
      <div className="font-mono">{time.toLocaleTimeString()}</div>
    </div>
  )
}