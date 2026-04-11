'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-primary">Delta Car</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-serif font-bold text-foreground mb-6">
              Your Premium Car Marketplace
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Buy, sell, rent vehicles, or find maintenance services all in one place. Built for car enthusiasts and everyday drivers.
            </p>
            <div className="flex gap-4">
              <Link href="/listings?type=sale">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Browse Cars
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" variant="outline">
                  Sell Your Car
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-secondary/20 rounded-2xl h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Featured Cars Gallery</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">
            Everything You Need
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Buy & Sell',
                description: 'Find your dream car or sell yours with detailed listings and secure transactions.',
              },
              {
                title: 'Rent Vehicles',
                description: 'Daily rental options for short-term needs with transparent pricing.',
              },
              {
                title: 'Maintenance Services',
                description: 'Connect with trusted service providers for all your vehicle needs.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg bg-background border border-border">
                <h4 className="text-xl font-serif font-bold text-primary mb-3">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-serif font-bold mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of happy buyers, sellers, and service seekers on Delta Car.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Create Account Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
