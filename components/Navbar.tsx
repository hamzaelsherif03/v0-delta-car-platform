'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useTranslation } from '@/lib/useTranslation'
import { LanguageToggle } from './LanguageToggle'

interface NavbarProps {
  user?: any
  showDashboard?: boolean
}

export function Navbar({ user, showDashboard = true }: NavbarProps) {
  const router = useRouter()
  const { t, locale } = useTranslation()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = locale === 'ar' ? '/ar' : '/'
  }

  const getLocalizedHref = (href: string) => {
    if (locale === 'ar' && !href.startsWith('/ar')) {
      return '/ar' + href
    }
    return href
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href={getLocalizedHref('/')} className="flex items-center gap-4 group py-2 rtl:flex-row-reverse">
          <img 
            src="/logo.png" 
            alt="Delta" 
            className="h-14 w-auto object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm" 
          />
          <h1 className="text-2xl font-playfair font-bold text-primary tracking-tight">
            Delta Car
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 rtl:flex-row-reverse">
          <Link href={getLocalizedHref('/listings')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t('nav.inventory')}
          </Link>
          <Link href={getLocalizedHref('/services')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t('nav.services')}
          </Link>
          <Link href={getLocalizedHref('/how-it-works')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t('nav.howItWorks')}
          </Link>
          <Link href={getLocalizedHref('/about')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            {t('nav.about')}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 rtl:flex-row-reverse">
          <LanguageToggle />
          <Link href={getLocalizedHref('/#support')}>
            <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-primary font-medium gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {t('nav.support')}
            </Button>
          </Link>
          {user ? (
            <>
              {showDashboard && (
                <Link href={getLocalizedHref('/dashboard')}>
                  <Button variant="ghost">{t('nav.dashboard')}</Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                {t('nav.signOut')}
              </Button>
            </>
          ) : (
            <>
              <Link href={getLocalizedHref('/auth/login')}>
                <Button variant="ghost">{t('nav.signIn')}</Button>
              </Link>
              <Link href={getLocalizedHref('/auth/signup')}>
                <Button>{t('nav.getStarted')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
