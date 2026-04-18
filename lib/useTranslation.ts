'use client'

import { useRouter } from 'next/navigation'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'

type Locale = 'en' | 'ar'

const translations: Record<Locale, typeof en> = {
  en,
  ar,
}

export function useTranslation() {
  const router = useRouter()
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  
  // Detect locale from pathname (/ar/... is Arabic, everything else is English)
  const locale: Locale = pathname.startsWith('/ar') ? 'ar' : 'en'
  
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value === 'string') {
      return value
    }
    
    return defaultValue || key
  }

  return { t, locale }
}
