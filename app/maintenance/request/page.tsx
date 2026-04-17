'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

import { LoadingPage } from '@/components/ui/loading-page'
import { Navbar } from '@/components/Navbar'
import { CheckCircle2, ChevronRight, Wrench } from 'lucide-react'

const SERVICE_TYPES = [
  'Precision Maintenance',
  'Elite Inspection',
  'Secure Transport',
  'Master Detailing',
  'Performance Tuning',
  'Ceramic Coating',
  'Oil & Filter Change',
  'Brake System Service',
  'Transmission Calibration',
  'Suspension Alignment',
  'Comprehensive Diagnostic',
  'Other',
]

// Mapping query param IDs to actual titles
const SERVICE_PARAM_MAP: Record<string, string> = {
  maintenance: 'Precision Maintenance',
  inspection: 'Elite Inspection',
  transport: 'Secure Transport',
  detailing: 'Master Detailing',
}

function MaintenanceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceQuery = searchParams.get('service')

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [formData, setFormData] = useState({
    service_type: '',
    contact_name: '',
    description: '',
    preferred_date: '',
    preferred_time: '',
    contact_phone: '',
  })

  useEffect(() => {
    // Pre-fill service type if passed via query param
    if (serviceQuery && SERVICE_PARAM_MAP[serviceQuery]) {
      setFormData(prev => ({ ...prev, service_type: SERVICE_PARAM_MAP[serviceQuery] }))
    }

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setUser(data.session.user)
        try {
          // Fetch user details to auto-fill
          const { data: userData } = await supabase
            .from('users')
            .select('phone, full_name')
            .eq('id', data.session.user.id)
            .single()

          setFormData(prev => ({
            ...prev,
            contact_phone: userData?.phone || '',
            contact_name: userData?.full_name || '',
          }))
        } catch (e) {
          console.error("Error fetching user profile", e)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [serviceQuery])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!formData.service_type) {
      setError('Please select a precise service type to proceed.')
      setIsSubmitting(false)
      return
    }

    if (!formData.contact_name.trim()) {
      setError('Please provide your name.')
      setIsSubmitting(false)
      return
    }

    if (!formData.contact_phone) {
      setError('Please provide a contact phone number.')
      setIsSubmitting(false)
      return
    }

    try {
      const payload: any = {
        service_type: formData.service_type,
        contact_name: formData.contact_name,
        description: formData.description,
        preferred_date: formData.preferred_date || null,
        preferred_time: formData.preferred_time || null,
        contact_phone: formData.contact_phone,
        status: 'pending',
      }

      // Only attach user_id if logged in
      if (user?.id) {
        payload.user_id = user.id
      }

      const { error: insertError } = await supabase
        .from('maintenance_requests')
        .insert(payload)

      if (insertError) throw insertError

      if (user?.id) {
        // Logged-in users go to their maintenance dashboard
        router.push('/maintenance?success=true')
      } else {
        // Guests see an inline success message
        setSubmitSuccess(true)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while submitting your request.')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingPage message="Calibrating interface..." />
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 text-center">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Request Submitted</h1>
        <p className="text-muted-foreground text-lg mb-3 max-w-lg mx-auto">
          Thank you, <span className="text-foreground font-semibold">{formData.contact_name}</span>. Your <span className="text-primary font-semibold">{formData.service_type}</span> request has been received.
        </p>
        <p className="text-muted-foreground text-sm mb-10 max-w-md mx-auto">
          Our concierge team will contact you at <span className="font-semibold text-foreground">{formData.contact_phone}</span> to confirm your booking.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push('/services')} className="h-12 px-6">Back to Services</Button>
          <Button onClick={() => { setSubmitSuccess(false); setFormData({ service_type: '', contact_name: '', description: '', preferred_date: '', preferred_time: '', contact_phone: '' }) }} className="h-12 px-6">Book Another Service</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
      
      {/* Header Section */}
      <div className="mb-12 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
          <Wrench className="w-4 h-4" />
          Delta Service Center
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          Schedule <span className="text-primary italic">Service</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Enter your details below to schedule priority-level maintenance and care for your vehicle. Our concierge team will reach out to confirm your booking.
        </p>
      </div>

      <Card className="border-border bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden rounded-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
        <CardContent className="p-0 flex flex-col md:flex-row">
          
          {/* Left info Sidebar */}
          <div className="md:w-1/3 bg-secondary/30 p-8 border-r border-border hidden md:flex flex-col">
            <h3 className="font-serif text-xl font-bold mb-6">Service Benefits</h3>
            <ul className="space-y-6 flex-1">
              {[
                'Factory trained master technicians',
                'OEM certified parts & fluids',
                'Complimentary vehicle detailing',
                'Door-to-door vehicle transport',
                'Comprehensive biometric security'
              ].map((benefit, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">Assistance</p>
              <p className="text-sm font-semibold">1-800-DELTA-CARE</p>
            </div>
          </div>

          {/* Form Area */}
          <div className="md:w-2/3 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-destructive/10 border-l-4 border-destructive text-destructive rounded-r-md text-sm font-medium animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4 border-b border-border/50 pb-2">Client Details</h3>
                
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                    <Input
                      type="text"
                      placeholder="e.g. James Bond"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className="bg-background/50 border-border/60 hover:border-primary/50 focus:border-primary transition-colors h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Phone *</label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="bg-background/50 border-border/60 hover:border-primary/50 focus:border-primary transition-colors h-11"
                      required
                    />
                  </div>
                </div>
              </div>


              {/* Service Details */}
              <div className="space-y-5 pt-2">
                <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4 border-b border-border/50 pb-2">Service Requirements</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Protocol *</label>
                  <div className="relative">
                    <select
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full px-4 py-3 border border-border/60 rounded-md text-sm appearance-none bg-background/50 hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select precise service...</option>
                      {SERVICE_TYPES.map((type) => (
                        <option key={type} value={type} className="bg-background text-foreground">
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred Date</label>
                    <Input
                      type="date"
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="bg-background/50 border-border/60 hover:border-primary/50 focus:border-primary transition-colors h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred Time</label>
                    <Input
                      type="time"
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="bg-background/50 border-border/60 hover:border-primary/50 focus:border-primary transition-colors h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Additional Context</label>
                  <textarea
                    placeholder="Describe specific symptoms, requirements, or provide vin number..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-border/60 rounded-md text-sm resize-none bg-background/50 hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors block"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-border/50 items-center justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-12"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  loading={isSubmitting}
                  className="w-full sm:w-auto h-12 px-8 font-semibold group"
                >
                  Confirm Request 
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  )
}

export default function MaintenanceRequestPage() {
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null)
    })
  }, [])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Navbar user={user} />
      <Suspense fallback={<LoadingPage message="Loading interface..." />}>
        <MaintenanceForm />
      </Suspense>
    </main>
  )
}
