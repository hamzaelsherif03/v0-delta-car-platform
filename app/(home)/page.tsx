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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-slideInLeft">
            <h1 className="text-6xl md:text-7xl font-playfair font-bold text-foreground leading-tight mb-8 tracking-tight">
              Where Engineering <br />
              <span className="text-primary italic font-light">Meets Elegance.</span>
            </h1>
            <p className="text-lg text-muted-foreground/80 mb-12 leading-relaxed max-w-xl font-light">
              Delta Car is more than a marketplace; it is an ecosystem of automotive passion. Discover an elite fleet of vehicles designed for those who demand a superior journey.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/listings?type=sale">
                <Button size="lg" className="bg-primary hover:bg-primary/85 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
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
          <div className="relative bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-3xl h-96 md:h-[500px] flex items-center justify-center overflow-hidden border border-border/50 shadow-xl hover:shadow-2xl transition-shadow duration-500 animate-slideInRight">
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
                              ? `${listing.price?.toLocaleString()} EGP`
                              : `${listing.price_per_day} EGP/day`}
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

      {/* Scale & Trust Strip */}
      <section className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-y border-border/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <p className="text-4xl font-playfair font-bold text-primary">5k+</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-3">Active Listings</p>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <p className="text-4xl font-playfair font-bold text-primary">12k+</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-3">Global Users</p>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <p className="text-4xl font-playfair font-bold text-primary">15min</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-3">Avg Response</p>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <p className="text-4xl font-playfair font-bold text-primary">99%</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-3">Safety Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-playfair font-bold text-foreground">Explore by Lifestyle</h2>
            <p className="text-base text-muted-foreground mt-3 max-w-lg">Find the perfect match for your driving philosophy and personal style.</p>
          </div>
          <Link href="/listings" className="text-primary text-sm font-medium hover:text-primary/80 flex items-center gap-2 transition-colors">
            View full inventory <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { name: 'Luxury', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop', count: '1.2k' },
            { name: 'Performance', image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop', count: '840+' },
            { name: 'Electric', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop', count: '320+' },
            { name: 'Vintage', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop', count: '150+' },
            { name: 'Family', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop', count: '2.1k' },
          ].map((cat, i) => (
            <Link key={i} href={`/listings?category=${cat.name}`} className="group relative h-72 rounded-2xl overflow-hidden border border-border/30 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5">{cat.count} Units</p>
                <h4 className="text-lg font-serif font-bold">{cat.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-card/50 to-background/50 border-y border-border/30 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-16 text-center">
            Everything You Need
          </h2>
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
              <div key={i} className="p-8 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <h3 className="text-2xl font-playfair font-bold text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Spotlight */}
      <section className="bg-background py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-8 animate-slideInLeft">
              <h2 className="text-5xl md:text-6xl font-playfair font-bold text-foreground leading-tight">Beyond the Sale: <br /><span className="text-primary italic font-light">Precision Care</span></h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-light">
                Delta Car isn't just about discovery. We ensure your vehicle maintains its peak engineering through our elite network of specialized technicians.
              </p>
              <ul className="space-y-4">
                {[
                  'Certified Multi-Point Inspections',
                  'Performance Tuning & Optimization',
                  'Nationwide Concierge Transport',
                  'Strategic Maintenance Scheduling'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link href="/services">
                  <Button variant="outline" size="lg">Explore Concierge Services</Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-square rounded-full border border-primary/20 absolute -top-8 -right-8 w-64 h-64 animate-pulse" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                <Image 
                  src="/images/services/maintenance.png" 
                  alt="Service" 
                  width={800} 
                  height={600} 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-secondary/5 to-background/50 py-32 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-16">The Delta Experience</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The inspection service gave me total peace of mind when buying my 911. The detail was unmatched.",
                author: "Amr M.",
                role: "Collector"
              },
              {
                quote: "Sold my G-Wagon in 4 days. The reach of this platform is incredible compared to standard local listings.",
                author: "Noha S.",
                role: "Private Seller"
              },
              {
                quote: "Finally, a platform that understands what car enthusiasts actually need. The UI is a dream to use.",
                author: "Mostafa A.",
                role: "Automotive Journalist"
              }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-lg text-left relative transition-all duration-300 hover:-translate-y-2 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-primary/20 text-6xl font-playfair absolute top-6 left-8">"</div>
                <p className="text-muted-foreground mb-8 italic relative z-10 leading-relaxed text-base">{t.quote}</p>
                <div>
                  <p className="font-semibold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
            <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-8 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-95 leading-relaxed">
              Join thousands of happy buyers, sellers, and service seekers on Delta Car.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl">
                Create Account Now
              </Button>
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
