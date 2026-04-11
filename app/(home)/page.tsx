'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { LoadingPage } from '@/components/ui/loading-page'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [featuredListings, setFeaturedListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      // Fetch User
      const { data: authData } = await supabase.auth.getSession()
      setUser(authData.session?.user || null)

      // Fetch Latest Listings for Hero
      const { data: listingsData } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(5)

      setFeaturedListings(listingsData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  // Auto-cycle slides
  useEffect(() => {
    if (featuredListings.length <= 1) return
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredListings.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredListings.length])

  if (loading) {
    return <LoadingPage message="Warming up the V8..." />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

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
              <Link href="/listings/create">
                <Button size="lg" variant="outline">
                  Sell Your Car
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative bg-secondary/20 rounded-2xl h-96 flex items-center justify-center overflow-hidden border border-border shadow-2xl">
            {featuredListings.length > 0 ? (
              featuredListings.map((listing, index) => (
                <div
                  key={listing.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Link href={`/listings/${listing.id}`} className="group block h-full w-full relative">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No Image Available</span>
                      </div>
                    )}
                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-primary font-bold text-sm mb-1 uppercase tracking-wider">{listing.type === 'sale' ? 'For Sale' : 'For Rent'}</p>
                          <h3 className="text-2xl font-serif font-bold leading-tight">
                            {listing.brand} {listing.model}
                          </h3>
                          <p className="text-white/80 text-sm mt-1">{listing.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-serif font-bold">
                            {listing.type === 'sale'
                              ? `$${listing.price?.toLocaleString()}`
                              : `$${listing.price_per_day}/day`}
                          </p>
                          <span className="text-xs text-white/60">View Details →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">Ready to list your car?</h3>
                <p className="text-muted-foreground mb-6 max-w-xs mx-auto">Market your vehicle to thousands of seekers. Fast, easy, and secure.</p>
                <Link href="/listings/create">
                  <Button variant="outline">Create a Listing</Button>
                </Link>
              </div>
            )}
            
            {/* Dots navigation */}
            {featuredListings.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {featuredListings.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeSlide ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
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
      {!user && (
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
      )}
    </main>
  )
}
