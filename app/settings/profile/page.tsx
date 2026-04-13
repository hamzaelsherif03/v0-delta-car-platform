'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { supabase, type User } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { LoadingPage } from '@/components/ui/loading-page'

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: '',
    role: 'buyer' as const,
  })

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getSession()

      if (!authData.session) {
        router.push('/auth/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.session.user.id)
        .single()

      if (userData) {
        setUser(userData as User)
        setFormData({
          full_name: userData.full_name || '',
          phone: userData.phone || '',
          city: userData.city || '',
          role: userData.role,
        })
        setAvatarPreview(userData.avatar_url || '')
      }

      setLoading(false)
    }

    fetchUser()
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let finalAvatarUrl = avatarPreview

      if (newAvatarFile) {
        const fileExt = newAvatarFile.name.split('.').pop()
        const fileName = `avatars/${user!.id}/${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('listings') // Reusing the public listings bucket architecture
          .upload(fileName, newAvatarFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(fileName)

        finalAvatarUrl = publicUrl
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          city: formData.city,
          role: formData.role,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user!.id)

      if (updateError) throw updateError

      toast.success('Profile updated successfully!')
      setUser({
        ...user!,
        ...formData,
        avatar_url: finalAvatarUrl
      })
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingPage message="Retrieving profile..." />
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />
      
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-serif font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 pb-4">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-secondary/50 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  type="text"
                  placeholder="Amr Mostafa"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  type="text"
                  placeholder="Cairo, Egypt"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Type</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'buyer' | 'seller' | 'both',
                    })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isSubmitting}
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="both">Both Buyer & Seller</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Select your primary role on Delta Car
                </p>
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
