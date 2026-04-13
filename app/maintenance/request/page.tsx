'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

import { LoadingPage } from '@/components/ui/loading-page'

import { Navbar } from '@/components/Navbar'

const SERVICE_TYPES = [
  'Oil Change',
  'Tire Replacement',
  'Brake Service',
  'Engine Tune-up',
  'Battery Replacement',
  'Transmission Service',
  'Alignment',
  'General Inspection',
  'AC Service',
  'Other',
]

export default function MaintenanceRequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    service_type: '',
    description: '',
    preferred_date: '',
    preferred_time: '',
    contact_phone: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/auth/login')
        return
      }

      // Fetch user phone if available
      const { data: userData } = await supabase
        .from('users')
        .select('phone')
        .eq('id', data.session.user.id)
        .single()

      setFormData((prev) => ({
        ...prev,
        contact_phone: userData?.phone || '',
      }))
      setUser(data.session.user)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!formData.service_type) {
      setError('Please select a service type')
      setIsSubmitting(false)
      return
    }

    if (!formData.contact_phone) {
      setError('Please provide a contact phone number')
      setIsSubmitting(false)
      return
    }

    try {
      const { error: insertError } = await supabase
        .from('maintenance_requests')
        .insert({
          user_id: user.id,
          service_type: formData.service_type,
          description: formData.description,
          preferred_date: formData.preferred_date || null,
          preferred_time: formData.preferred_time || null,
          contact_phone: formData.contact_phone,
          status: 'pending',
        })

      if (insertError) throw insertError

      router.push('/maintenance')
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Submit Maintenance Request</CardTitle>
            <CardDescription>Request vehicle maintenance services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Service Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Type *</label>
                <select
                  value={formData.service_type}
                  onChange={(e) =>
                    setFormData({ ...formData, service_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select a service type</option>
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  placeholder="Describe the issue or service needed in detail..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Date</label>
                  <Input
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) =>
                      setFormData({ ...formData, preferred_date: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Time</label>
                  <Input
                    type="time"
                    value={formData.preferred_time}
                    onChange={(e) =>
                      setFormData({ ...formData, preferred_time: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Phone *</label>
                <Input
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
