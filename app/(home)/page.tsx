'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
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
  const [visiblePhones, setVisiblePhones] = useState<{ [key: string]: string }>({})
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false, isScrollable: false })
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const teamSectionRef = useRef<HTMLDivElement>(null)

  const teamMembers = [
    { name: 'Doaa Yasser', image: '/images/Customer Service/Doaa Yasser.jpeg' },
    { name: 'Donia Ahmed', image: '/images/Customer Service/Donia Ahmed.jpeg' },
    { name: 'Donia Hassan', image: '/images/Customer Service/Donia Hassan.jpeg' },
    { name: 'Noureen Emad', image: '/images/Customer Service/Noureen Emad.jpeg' },
    { name: 'Shahd Wael', image: '/images/Customer Service/Shahd Wael.jpeg' },
    { name: 'Zeinab Ahmed', image: '/images/Customer Service/Zeinab Ahmed.jpeg' },
  ]

  const generateRandomPhone = () => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000)
    return `+20 1${Math.floor(Math.random() * 3)}${randomDigits}`
  }

  const handleContactClick = (name: string) => {
    if (!visiblePhones[name]) {
      setVisiblePhones({ [name]: generateRandomPhone() })
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const checkScroll = () => {
    if (scrollRef.current) {
      const el = scrollRef.current
      const maxScroll = el.scrollWidth - el.clientWidth
      
      setScrollState({
        canScrollLeft: el.scrollLeft > 5,
        canScrollRight: Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 5,
        isScrollable: maxScroll > 0,
      })
      
      if (maxScroll > 0) {
        setScrollProgress((el.scrollLeft / maxScroll) * 100)
      } else {
        setScrollProgress(0)
      }
    }
  }

  useEffect(() => {
    checkScroll()
    // Repeated checks to catch post-mount layouts (images loading, font rendering)
    const t1 = setTimeout(checkScroll, 100)
    const t2 = setTimeout(checkScroll, 500)
    const t3 = setTimeout(checkScroll, 1000)
    const currentScrollRef = scrollRef.current
    let observer: ResizeObserver | null = null

    if (currentScrollRef) {
      currentScrollRef.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)

      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => checkScroll())
        observer.observe(currentScrollRef)
        Array.from(currentScrollRef.children).forEach(child => observer.observe(child))
      }
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Hide if click was anywhere except inside a contact button or revealed phone box
      if (!target.closest('.contact-support-element')) {
        setVisiblePhones({})
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
      if (observer) observer.disconnect()
      document.removeEventListener('mousedown', handleClickOutside)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

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
            <h2 className="text-[3.375rem] font-serif font-bold text-foreground leading-tight mb-6">
              Where Engineering <br />
              <span className="text-primary italic">Meets Elegance.</span>
            </h2>
            <p className="text-base text-muted-foreground/90 mb-8 leading-relaxed max-w-lg font-light">
              Delta Car is more than a marketplace; it is an ecosystem of automotive passion. Discover an elite fleet of vehicles designed for those who demand a superior journey.
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
      <section className="bg-primary/5 border-y border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-serif font-bold text-primary">5k+</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Active Listings</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-primary">12k+</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Global Users</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-primary">15min</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Avg Response</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-primary">99%</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Safety Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h3 className="text-2xl font-serif font-bold text-foreground">Explore by Lifestyle</h3>
            <p className="text-sm text-muted-foreground mt-1">Find the perfect match for your driving philosophy.</p>
          </div>
          <Link href="/listings" className="text-primary text-sm font-medium hover:underline flex items-center gap-2">
            View full inventory <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: 'Luxury', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop', count: '1.2k' },
            { name: 'Performance', image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop', count: '840+' },
            { name: 'Electric', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop', count: '320+' },
            { name: 'Vintage', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop', count: '150+' },
            { name: 'Family', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop', count: '2.1k' },
          ].map((cat, i) => (
            <Link key={i} href={`/listings?category=${cat.name}`} className="group relative h-64 rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
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

      {/* Service Spotlight */}
      <section className="bg-background py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <h3 className="text-4xl font-serif font-bold text-foreground">Beyond the Sale: <br /><span className="text-primary italic">Precision Care</span></h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
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
      <section className="bg-secondary/10 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-serif font-bold mb-12">The Delta Experience</h3>
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
              <div key={i} className="p-8 rounded-2xl bg-card border border-border text-left relative">
                <div className="text-primary text-5xl font-serif absolute top-4 left-6 opacity-20">"</div>
                <p className="text-muted-foreground mb-6 italic relative z-10">{t.quote}</p>
                <div>
                  <p className="font-bold">{t.author}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Service Team */}
      <section id="support" ref={teamSectionRef} className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-foreground mb-4">Our Customer Service Team</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet our dedicated professionals ready to assist you with every step of your automotive journey.
            </p>
          </div>

          <div className="relative group/carousel">
            {/* Scroll Navigation Arrows */}
            <button 
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className={`absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/95 backdrop-blur-md border border-border shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 sm:flex ${
                scrollState.canScrollLeft 
                  ? 'text-foreground hover:bg-primary hover:text-white opacity-100 hover:scale-110 cursor-pointer' 
                  : 'opacity-0 scale-90 pointer-events-none'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <button 
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className={`absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/95 backdrop-blur-md border border-border shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 sm:flex ${
                scrollState.canScrollRight 
                  ? 'text-foreground hover:bg-primary hover:text-white opacity-100 hover:scale-110 cursor-pointer' 
                  : 'opacity-0 scale-90 pointer-events-none'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory hide-scrollbar pt-4 px-2"
            >
              {teamMembers.map((member, i) => (
                <div 
                  key={i} 
                  className="flex-none w-72 snap-center group relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  </div>
                  
                  {/* Content Container - Fixed bottom instead of absolute translation to avoid cropping */}
                  <div className="absolute inset-x-0 bottom-0 p-5 pt-10 text-white">
                    <h4 className="text-lg font-serif font-bold mb-0.5">{member.name}</h4>
                    
                    {/* Role text - animate this only */}
                    <div className="overflow-hidden h-0 group-hover:h-5 transition-all duration-500">
                      <p className="text-xs text-white/70">Support Specialist</p>
                    </div>
                    
                    <div className="mt-4 contact-support-element">
                      {visiblePhones[member.name] ? (
                        <div className="bg-primary/40 backdrop-blur-md border border-primary/50 rounded-lg py-2 px-3 text-center animate-in fade-in zoom-in-95 ring-1 ring-white/20">
                          <p className="text-white text-sm font-bold tracking-wider drop-shadow-sm">{visiblePhones[member.name]}</p>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleContactClick(member.name)}
                          size="sm"
                          className="w-full bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 text-xs font-bold"
                        >
                          Contact Support
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scroll Progress Indicator */}
            <div className={`max-w-[200px] mx-auto mt-8 transition-opacity ${scrollState.isScrollable ? 'opacity-80 hover:opacity-100' : 'opacity-100'}`}>
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground mb-3 font-semibold uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2v4"></path><path d="M17 18v4"></path><path d="M7 2v4"></path><path d="M7 18v4"></path><path d="M22 12H2"></path><path d="M18 8l4 4-4 4"></path><path d="M6 8L2 12l4 4"></path></svg>
                <span>Scroll to explore</span>
              </div>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
                  style={{ 
                    width: '30%', 
                    marginLeft: `${Math.max(0, Math.min(70, scrollProgress * 0.7))}%` 
                  }}
                />
              </div>
            </div>
          </div>
          
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
          `}</style>
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
