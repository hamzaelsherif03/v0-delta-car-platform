'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { LoadingPage } from '@/components/ui/loading-page'
import { useTranslation } from '@/lib/useTranslation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, locale } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
    } else {
      const nextUrl = searchParams.get('next') || (locale === 'ar' ? '/ar/dashboard' : '/dashboard')
      router.push(nextUrl)
    }
  }

  const getLocalizedHref = (href: string) => {
    if (locale === 'ar' && !href.startsWith('/ar')) {
      return '/ar' + href
    }
    return href
  }

  if (loading) {
    return <LoadingPage message={locale === 'ar' ? 'جاري التحقق من بيانات الاعتماد...' : 'Verifying credentials...'} />
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md rtl:text-right">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-serif">{t('auth.signIn')}</CardTitle>
          <CardDescription>{t('auth.signInDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
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
              <div className="flex items-center justify-between rtl:flex-row-reverse">
                <label className="text-sm font-medium">{t('auth.password')}</label>
                <Link
                  href={getLocalizedHref('/auth/forgot-password')}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <Input
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              {t('auth.signIn')}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center rtl:text-right">
            {t('auth.noAccount')}{' '}
            <Link href={getLocalizedHref('/auth/signup')} className="text-primary hover:underline font-medium">
              {t('auth.signUp')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
