'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { LoadingPage } from '@/components/ui/loading-page'
import { useTranslation } from '@/lib/useTranslation'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'buyer',
      })

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
      } else {
        const nextUrl = searchParams.get('next') || (locale === 'ar' ? '/ar/dashboard' : '/dashboard')
        window.location.href = nextUrl
      }
    }
  }

  const getLocalizedHref = (href: string) => {
    if (locale === 'ar' && !href.startsWith('/ar')) {
      return '/ar' + href
    }
    return href
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md rtl:text-right">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-serif">{locale === 'ar' ? 'انضم إلى ديلتا كار' : 'Join Delta Car'}</CardTitle>
          <CardDescription>{locale === 'ar' ? 'أنشئ حساباً للبدء' : 'Create an account to get started'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.name')}</label>
              <Input
                type="text"
                placeholder={t('auth.namePlaceholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.email')}</label>
              <Input
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.password')}</label>
              <Input
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              {locale === 'ar' ? 'إنشاء حساب' : 'Create Account'}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center rtl:text-right">
            {t('auth.alreadyHave')}{' '}
            <Link 
              href={`${getLocalizedHref('/auth/login')}${searchParams.get('next') ? `?next=${searchParams.get('next')}` : ''}`} 
              className="text-primary hover:underline font-medium"
            >
              {t('auth.signIn')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  )
}
