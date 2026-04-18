'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Detect locale from pathname and update HTML attributes
    const isArabic = pathname.startsWith('/ar')
    const htmlEl = document.documentElement
    
    if (isArabic) {
      htmlEl.setAttribute('lang', 'ar')
      htmlEl.setAttribute('dir', 'rtl')
    } else {
      htmlEl.setAttribute('lang', 'en')
      htmlEl.setAttribute('dir', 'ltr')
    }
  }, [pathname])

  return <>{children}</>
}
