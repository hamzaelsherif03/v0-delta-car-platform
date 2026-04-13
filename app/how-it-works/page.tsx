'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { LoadingPage } from '@/components/ui/loading-page'
import { Shield, Search, CreditCard, CheckCircle2, Megaphone, Truck } from 'lucide-react'

export default function HowItWorksPage() {
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
    return <LoadingPage message="Mapping the journey..." />
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar user={user} />
      
      {/* Hero */}
      <section className="bg-secondary/5 py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Complexity, <span className="text-primary italic">Simplified.</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Automotive transactions should be as precise as the vehicles involved. We've streamlined every step of the journey.
          </p>
        </div>
      </section>

      {/* Journeys */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        
        {/* For Buyers */}
        <section>
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 order-2 md:order-1">
              <h2 className="text-2xl font-serif font-bold mb-8">For the Collector</h2>
              <div className="space-y-12">
                {[
                  { icon: Search, title: "Curated Discovery", desc: "Filter through our elite fleet using state-of-the-art search parameters. From vintage air-cooled to modern electrics." },
                  { icon: Shield, title: "Verified Audit", desc: "Request a Delta-certified inspection. We examine 250+ points and provide a digital integrity report." },
                  { icon: CreditCard, title: "Secure Acquisition", desc: "Execute transactions using our encrypted escrow partners. Funds are only released once milestones are met." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="shrink-0 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">{i+1}. {step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <div className="aspect-[4/5] bg-secondary/20 rounded-3xl overflow-hidden shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Buyer" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
              </div>
            </div>
          </div>
        </section>

        {/* For Sellers */}
        <section>
          <div className="flex flex-col md:flex-row items-center gap-16">
             <div className="md:w-1/2">
                <div className="aspect-[4/5] bg-secondary/20 rounded-3xl overflow-hidden shadow-2xl relative">
                  <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Seller" />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-serif font-bold mb-8">For the Visionary</h2>
              <div className="space-y-12">
                {[
                  { icon: Megaphone, title: "Elite Exposure", desc: "List your vehicle with multi-angle high-res imagery and deep specifications. Reach a global audience of verified buyers." },
                  { icon: CheckCircle2, title: "Platform Verification", desc: "Our moderation team validates your documentation to ensure your listing carries the 'Delta Authorized' status." },
                  { icon: Truck, title: "Seamless Delivery", desc: "Opt for our concierge transport to deliver your vehicle securely to its new home, anywhere on the planet." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="shrink-0 h-14 w-14 rounded-2xl bg-secondary/80 flex items-center justify-center text-background">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">{i+1}. {step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Security Banner */}
      <section className="bg-background py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="p-12 rounded-3xl bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h3 className="text-3xl font-serif font-bold mb-2">Security is Standard</h3>
                <p className="opacity-80">All transactions are backed by industrial-grade encryption and KYC verification.</p>
              </div>
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="h-12 w-12 rounded-full border-2 border-primary bg-secondary/20 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" />
                   </div>
                 ))}
                 <div className="h-12 w-12 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-xs font-bold">+10k</div>
              </div>
           </div>
        </div>
      </section>
    </main>
  )
}
