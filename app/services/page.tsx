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
