'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // When the path or search params change, show the bar briefly
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-primary/20 overflow-hidden">
      <div className="h-full bg-primary animate-progress-bar shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
      <style jsx>{`
        .animate-progress-bar {
          width: 0%;
          animation: progress 0.6s ease-in-out forwards;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
