'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function CreateListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState({
    type: 'sale',
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    color: '',
    location: '',
    description: '',
    price: '',
    price_per_day: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/auth/login')
        return
      }

      setUser(data.session.user)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const { error: insertError } = await supabase.from('listings').insert({
        user_id: user.id,
        type: formData.type,
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        year: formData.year ? parseInt(formData.year) : null,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        color: formData.color,
        location: formData.location,
        description: formData.description,
        price: formData.type === 'sale' && formData.price ? parseFloat(formData.price) : null,
        price_per_day: formData.type === 'rent' && formData.price_per_day ? parseFloat(formData.price_per_day) : null,
        status: 'available',
        images: [],
        specs: {},
      })

      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Create New Listing</CardTitle>
            <CardDescription>List your vehicle for sale or rent</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Listing Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Listing Type</label>
                <div className="flex gap-4">
                  {['sale', 'rent'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={formData.type === type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  type="text"
                  placeholder="e.g., 2020 Honda Civic EX"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Vehicle Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Input
                    type="text"
                    placeholder="e.g., Honda"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Input
                    type="text"
                    placeholder="e.g., Civic"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mileage (km)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <Input
                    type="text"
                    placeholder="e.g., Black"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    type="text"
                    placeholder="e.g., New York, NY"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {formData.type === 'sale' ? 'Price ($)' : 'Daily Rate ($)'}
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={
                    formData.type === 'sale'
                      ? formData.price
                      : formData.price_per_day
                  }
                  onChange={(e) =>
                    formData.type === 'sale'
                      ? setFormData({ ...formData, price: e.target.value })
                      : setFormData({ ...formData, price_per_day: e.target.value })
                  }
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  placeholder="Describe the vehicle, its condition, features, and why someone should be interested..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
