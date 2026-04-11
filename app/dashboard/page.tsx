'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, type User } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      
      if (!data.session) {
        router.push('/auth/login')
        return
      }

      // Fetch user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single()

      setUser(userData as User)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.full_name}!</p>
          </div>
          <Button
            variant="outline"
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Listings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">My Listings</CardTitle>
              <CardDescription>Manage your car listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {user.role === 'seller' || user.role === 'both'
                  ? 'Create and manage your vehicle listings'
                  : 'Upgrade your account to list vehicles'}
              </p>
              <Button asChild>
                <Link href="/listings/create">Create Listing</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Favorites Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Saved Listings</CardTitle>
              <CardDescription>Your favorite vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse and manage your saved listings
              </p>
              <Button variant="outline" asChild>
                <Link href="/listings?favorites=true">View Favorites</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Rentals Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Rental Listings</CardTitle>
              <CardDescription>Daily car rentals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse vehicles available for daily rent
              </p>
              <Button variant="outline" asChild>
                <Link href="/listings?type=rent">View Rentals</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Maintenance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Maintenance</CardTitle>
              <CardDescription>Service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Submit or track maintenance requests
              </p>
              <Button variant="outline" asChild>
                <Link href="/maintenance">View Services</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Profile Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  <p className="font-medium">{user.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">City</label>
                  <p className="font-medium">{user.city || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Account Type</label>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </div>
              <Button className="mt-6" asChild>
                <Link href="/settings/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
