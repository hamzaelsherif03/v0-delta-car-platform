'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

  if (loading) {
    return <LoadingPage message="Calibrating equipment..." />
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      
      {/* Hero */}
      <section className="relative py-32 bg-gradient-to-b from-secondary/10 to-background/50 border-b border-border/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fadeInUp">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-foreground mb-6 leading-tight">Automotive Excellence, <br /><span className="text-primary italic font-light">As a Service.</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl font-light">
              Delta Car Concierge ensures your vehicle remains a masterpiece of engineering. From routine care to intercontinental logistics, we manage every detail.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service, i) => (
            <Card key={service.id} className="group overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-2 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-0 flex flex-col sm:flex-row h-full">
                <div className="sm:w-2/5 relative h-56 sm:h-auto overflow-hidden">
                   <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                <div className="sm:w-3/5 p-8 flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-10 pt-8 border-t border-border/30 flex items-center justify-between">
                    <Link href={service.href}>
                      <Button variant="ghost" className="p-0 hover:bg-transparent group/btn text-primary hover:text-primary/80 transition-colors">
                        Schedule Now <span className="ml-2 transition-transform group-hover/btn:translate-x-2">→</span>
                      </Button>
                    </Link>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">Priority Service</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground py-32 overflow-hidden relative animate-fadeIn">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-4xl md:text-5xl font-playfair italic mb-10 font-light leading-tight">"Trust is built on precision, and at Delta Car, precision is our only standard."</p>
          <div className="h-1 w-24 bg-accent/60 mx-auto mb-8 rounded-full" />
          <p className="uppercase tracking-widest text-sm opacity-90 font-semibold">Director of Engineering</p>
        </div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 border-[50px] border-white/10 rounded-full" />
        <div className="absolute -right-32 -top-32 w-96 h-96 border-[50px] border-white/5 rounded-full" />
      </section>
    </main>
  )
}
