'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { LoadingPage } from '@/components/ui/loading-page'
import { Wrench, ShieldCheck, Truck, Sparkles } from 'lucide-react'

const SERVICES = [
  {
    id: 'maintenance',
    title: 'Precision Maintenance',
    description: 'Specialized servicing from performance tuning to routine oil changes using grade-A synthetic lubricants.',
    icon: Wrench,
    image: '/images/services/maintenance.png',
    href: '/maintenance/request'
  },
  {
    id: 'inspection',
    title: 'Elite Inspection',
    description: 'Our proprietary 250-point technical audit ensures your vehicle meets Delta standards of excellence.',
    icon: ShieldCheck,
    image: '/images/services/inspection.png',
    href: '/maintenance/request?service=inspection'
  },
  {
    id: 'transport',
    title: 'Secure Transport',
    description: 'Enclosed, climate-controlled logistics for high-value assets. Nationwide door-to-door concierge.',
    icon: Truck,
    image: '/images/services/transport.png',
    href: '/maintenance/request?service=transport'
  },
  {
    id: 'detailing',
    title: 'Master Detailing',
    description: 'Ceramic coating, paint correction, and interior restoration using biologically neutral formulations.',
    icon: Sparkles,
    image: '/images/services/detailing.png',
    href: '/maintenance/request?service=detailing'
  }
]

export default function ServicesPage() {
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

  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false, isScrollable: false })
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const engineers = [
    { name: 'Abdelrahman Amgad', image: '/images/Engineers/Abdelrahman Amgad .jpeg' },
    { name: 'Abdelrahman Khaled', image: '/images/Engineers/Abdelrahman Khaled.jpeg' },
    { name: 'Basmala Yasser', image: '/images/Engineers/Basmala Yasser.jpeg' },
    { name: 'Bassant Mohamed', image: '/images/Engineers/Bassant Mohamed.jpeg' },
    { name: 'Habiba Wagdy', image: '/images/Engineers/Habiba Wagdy.jpeg' },
    { name: 'Moaz Mohamed', image: '/images/Engineers/Moaz Mohamed.jpeg' },
    { name: 'Mohamed Elsayed', image: '/images/Engineers/Mohamed Elsayed.jpeg' },
    { name: 'Mohamed Mostafa', image: '/images/Engineers/Mohamed Mostafa.jpeg' },
    { name: 'Shahenda Mahmoud', image: '/images/Engineers/Shahenda Mahmoud.jpeg' },
  ]

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
    const t1 = setTimeout(checkScroll, 100)
    const t2 = setTimeout(checkScroll, 500)
    const t3 = setTimeout(checkScroll, 1000)
    
    let observer: ResizeObserver | null = null
    const currentScrollRef = scrollRef.current
    if (currentScrollRef) {
      window.addEventListener('resize', checkScroll)
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => checkScroll())
        observer.observe(currentScrollRef)
        Array.from(currentScrollRef.children).forEach(child => observer.observe(child))
      }
    }
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      if (currentScrollRef) {
        window.removeEventListener('resize', checkScroll)
      }
      if (observer) observer.disconnect()
    }
  }, [])

  if (loading) {
    return <LoadingPage message="Calibrating equipment..." />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      
      {/* Hero */}
      <section className="relative py-20 bg-secondary/5 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Automotive Excellence, <br /><span className="text-primary italic text-3xl md:text-4xl">As a Service.</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Delta Car Concierge ensures your vehicle remains a masterpiece of engineering. From routine care to intercontinental logistics, we manage every detail.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-10">
          {SERVICES.map((service) => (
            <Card key={service.id} className="group overflow-hidden border-border bg-card/50 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-md">
              <CardContent className="p-0 flex flex-col sm:flex-row h-full">
                <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
                   <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-black/10 transition-colors" />
                </div>
                <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <service.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                    <Link href={service.href}>
                      <Button variant="ghost" className="p-0 hover:bg-transparent group/btn">
                        Schedule Now <span className="ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                      </Button>
                    </Link>
                    <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Priority Status</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Engineering Team */}
      <section className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-foreground mb-4">Our Elite Engineering Team</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the technical masters behind the precision of Delta Car.
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
              {engineers.map((member, i) => (
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
                  
                  {/* Content Container */}
                  <div className="absolute inset-x-0 bottom-0 p-5 pt-10 text-white pb-8">
                    <h4 className="text-lg font-serif font-bold mb-0.5">{member.name}</h4>
                    <p className="text-xs text-primary font-bold tracking-widest uppercase mt-1">Lead Engineer</p>
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

      {/* Trust Quote */}
      <section className="bg-primary text-primary-foreground py-20 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-3xl font-serif italic mb-8">"Trust is built on precision, and at Delta Car, precision is our only standard."</p>
          <div className="h-px w-24 bg-primary-foreground/30 mx-auto mb-6" />
          <p className="uppercase tracking-[0.3em] text-sm opacity-80">Director of Engineering</p>
        </div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 border-[40px] border-white/5 rounded-full" />
      </section>
    </main>
  )
}
