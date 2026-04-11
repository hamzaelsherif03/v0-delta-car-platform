'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { supabase, type Listing } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  
  const [originalImages, setOriginalImages] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

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
    const fetchData = async () => {
      const { data: authData } = await supabase.auth.getSession()

      if (!authData.session) {
        router.push('/auth/login')
        return
      }

      setUser(authData.session.user)

      // Fetch existing listing
      const { data: listingData, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single()

      if (fetchError || !listingData) {
        setError('Listing not found')
        setLoading(false)
        return
      }

      // Check ownership
      if (listingData.user_id !== authData.session.user.id) {
        setError('You do not have permission to edit this listing')
        setLoading(false)
        return
      }

      const listing = listingData as Listing
      setFormData({
        type: listing.type,
        title: listing.title,
        brand: listing.brand,
        model: listing.model,
        year: listing.year || new Date().getFullYear(),
        mileage: listing.mileage?.toString() || '',
        color: listing.color || '',
        location: listing.location || '',
        description: listing.description || '',
        price: listing.price?.toString() || '',
        price_per_day: listing.price_per_day?.toString() || '',
      })
      setOriginalImages(listing.images || [])
      setExistingImages(listing.images || [])
      setLoading(false)
    }

    fetchData()
  }, [params.id, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setNewImages((prev) => [...prev, ...files])

    const previews = files.map((file) => URL.createObjectURL(file))
    setNewPreviews((prev) => [...prev, ...previews])
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setNewPreviews((prev) => prev.filter((_, i) => {
      if (i === index) URL.revokeObjectURL(prev[i])
      return i !== index
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Upload New Images in parallel
      const uploadPromises = newImages.map(async (image) => {
        const fileExt = image.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath)

        return publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      // 2. Cleanup orphaned images (prevent bucket leaks)
      const deletedImages = originalImages.filter(url => !existingImages.includes(url))
      if (deletedImages.length > 0) {
        const pathsToDelete = deletedImages.map(url => {
          const pathParts = url.split('/listings/')
          return pathParts.length > 1 ? pathParts[1] : null
        }).filter(Boolean) as string[]
        
        if (pathsToDelete.length > 0) {
          const { error: removeError } = await supabase.storage.from('listings').remove(pathsToDelete)
          if (removeError) console.error("Failed to delete orphaned images:", removeError)
        }
      }

      // 3. Update Listing
      const allImages = [...existingImages, ...uploadedUrls]

      const { error: updateError } = await supabase
        .from('listings')
        .update({
          type: formData.type,
          title: formData.title,
          brand: formData.brand,
          model: formData.model,
          year: formData.year ? parseInt(String(formData.year)) : null,
          mileage: formData.mileage ? parseInt(String(formData.mileage)) : null,
          color: formData.color,
          location: formData.location,
          description: formData.description,
          price: formData.type === 'sale' && formData.price ? parseFloat(String(formData.price)) : null,
          price_per_day: formData.type === 'rent' && formData.price_per_day ? parseFloat(String(formData.price_per_day)) : null,
          images: allImages,
        })
        .eq('id', params.id)

      if (updateError) throw updateError

      toast.success('Listing updated successfully!')
      router.push(`/listings/${params.id}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update listing')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Edit Listing</CardTitle>
            <CardDescription>Update your vehicle information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Images */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Vehicle Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((url, i) => (
                    <div key={`existing-${i}`} className="relative aspect-video rounded-lg overflow-hidden border border-border group">
                      <img src={url} alt="Existing" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  
                  {/* New Image Previews */}
                  {newPreviews.map((preview, i) => (
                    <div key={`new-${i}`} className="relative aspect-video rounded-lg overflow-hidden border border-primary/30 group">
                      <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-[10px] text-white text-center py-0.5">New</div>
                    </div>
                  ))}
                  
                  <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer text-muted-foreground hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    <span className="text-xs font-medium">Add Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
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
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
