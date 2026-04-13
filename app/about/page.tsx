'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { LoadingPage } from '@/components/ui/loading-page'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
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
    return <LoadingPage message="Reviewing our blueprints..." />
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar user={user} />
      
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Engineering"
        />
        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Driven by <span className="text-primary italic">Excellence.</span></h1>
          <p className="text-xl text-white/80 font-light leading-relaxed">
            Redefining the automotive ecosystem through technology, transparency, and a relentless pursuit of the perfect drive.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-semibold">The Delta Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Delta Car was born from a simple realization: the traditional automotive marketplace was fractured. Enthusiasts struggled to find precision-matched vehicles, sellers faced opaque processes, and maintenance was often a leap of faith.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We built Delta to be the **ultimate nexus**. A place where hardware meets high-performance software, providing a seamless experience from the first search to the final delivery and every maintenance interval in between.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-primary mb-1">2024</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Founded</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-1">Global</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Reach</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl -rotate-3" />
            <img 
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop" 
              className="relative rounded-2xl shadow-2xl z-10"
              alt="Mission"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/10 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-2xl font-serif font-semibold">Our Core Philosophy</h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparency First",
                desc: "Every record, every inspection, and every transaction is verified. We eliminate the guesswork from automotive luxury."
              },
              {
                title: "Elite Engineering",
                desc: "Our platform is built with the same precision as the vehicles we host. Speed, security, and elegance in every line of code."
              },
              {
                title: "Direct Connection",
                desc: "We remove the middleman, connecting enthusiasts directly to the sources of excellence, worldwide."
              }
            ].map((value, i) => (
              <Card key={i} className="bg-background border-border shadow-none hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 text-center space-y-4 px-8 pb-8">
                  <h3 className="text-xl font-serif font-bold text-primary">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {value.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Placeholder */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
          <span className="text-primary font-bold text-2xl">D</span>
        </div>
        <h3 className="text-2xl font-serif italic mb-6">"Delta isn't just a platform; it's a commitment to the art of driving."</h3>
        <p className="font-bold">The Engineering Team</p>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Delta HQ</p>
      </section>
    </main>
  )
}
