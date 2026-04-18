'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = useState<'en' | 'ar'>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Detect locale from pathname
    const detectedLocale = pathname.startsWith('/ar') ? 'ar' : 'en'
    setLocale(detectedLocale)
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', detectedLocale)
    }
    setMounted(true)
  }, [pathname])

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'
    
    // Get current pathname and switch locale
    let newPathname = pathname
    
    if (newLocale === 'ar') {
      // Switch to Arabic
      if (!pathname.startsWith('/ar')) {
        newPathname = '/ar' + pathname
      }
    } else {
      // Switch to English
      if (pathname.startsWith('/ar')) {
        newPathname = pathname.slice(3) || '/'
      }
    }
    
    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', newLocale)
    }
    
    router.push(newPathname)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleLanguage}
      aria-label={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      className="font-cairo px-4 py-1.5 rounded-full border border-current text-sm font-medium transition-colors hover:bg-primary/10"
    >
      {locale === 'en' ? 'العربية' : 'English'}
    </button>
  )
}
