'use client'

import { useState, useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'

const WITTY_MESSAGES = [
  "Polishing the chrome...",
  "Inflating the tires to 32 PSI...",
  "Checking the oil level...",
  "Warming up the V8 engine...",
  "Syncing with the ECU...",
  "Detailing the interior...",
  "Downloading more horsepower...",
  "Checking under the hood...",
  "Wait while we switch gears...",
  "Engaging Turbo mode...",
  "Polishing the exhaust tips...",
  "Calibrating the suspension...",
  "Checking the brake pads...",
  "Alignment in progress...",
  "Refueling the database...",
  "Clearing the windshield..."
]

export function LoadingPage({ message }: { message?: string }) {
  const [wittyMessage, setWittyMessage] = useState('')

  useEffect(() => {
    // Pick one message on mount
    const randomMessage = WITTY_MESSAGES[Math.floor(Math.random() * WITTY_MESSAGES.length)]
    setWittyMessage(randomMessage)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
      <div className="relative flex flex-col items-center gap-4">
        {/* Animated Brand Pulse */}
        <div className="absolute -inset-8 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        
        <Spinner className="h-12 w-12 text-primary stroke-[3px]" />
        
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-serif font-bold tracking-tight text-foreground">Delta Car</h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            {message || wittyMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
