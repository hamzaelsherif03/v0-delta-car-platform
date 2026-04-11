'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, type User, type Listing } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { LoadingPage } from '@/components/ui/loading-page'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [rentals, setRentals] = useState<Listing[]>([])
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

      // Fetch user listings (sale and rent)
      const { data: listingsData } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', data.session.user.id)
        .order('created_at', { ascending: false })

      // Fetch user favorites
      const { data: favsData } = await supabase
        .from('favorites')
        .select('*, listings(*)')
        .eq('user_id', data.session.user.id)
        .order('created_at', { ascending: false })

      // Fetch general rentals (for the rentals card)
      const { data: rentalsData } = await supabase
        .from('listings')
        .select('*')
        .eq('type', 'rent')
        .eq('status', 'available')
        .limit(3)

      setUser(userData as User)
      setListings((listingsData as Listing[]) || [])
      setFavorites(favsData || [])
      setRentals((rentalsData as Listing[]) || [])
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <LoadingPage />
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} showDashboard={false} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Listings Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="font-serif">My Listings</CardTitle>
                <CardDescription>Manage your car listings</CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/listings/create">Create New</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {listings.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">
                          {listing.brand} {listing.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {listing.type === 'sale' ? 'Sale' : 'Rent'} • {listing.status}
                        </p>
                      </div>
                      <Link href={`/listings/${listing.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    {user.role === 'seller' || user.role === 'both'
                      ? "You haven't created any listings yet."
                      : "Upgrade your account to start listing vehicles."}
                  </p>
                  {user.role === 'buyer' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/settings/profile">Upgrade to Seller</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favorites Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="font-serif">Saved Listings</CardTitle>
                <CardDescription>Your favorite vehicles</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/listings?favorites=true">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {favorites.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {favorites.slice(0, 3).map((fav) => (
                    <div
                      key={fav.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background"
                    >
                      <div>
                        <p className="font-medium">
                          {fav.listings?.brand} {fav.listings?.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${fav.listings?.price?.toLocaleString() || fav.listings?.price_per_day + '/day'}
                        </p>
                      </div>
                      <Link href={`/listings/${fav.listings?.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't saved any listings yet.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/listings">Browse Cars</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rentals Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="font-serif">Rental Listings</CardTitle>
                <CardDescription>Daily car rentals</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/listings?type=rent">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {rentals.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {rentals.map((rental) => (
                    <div
                      key={rental.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background"
                    >
                      <div>
                        <p className="font-medium">
                          {rental.brand} {rental.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${rental.price_per_day}/day
                        </p>
                      </div>
                      <Link href={`/listings/${rental.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    No rental vehicles available at the moment.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/listings?type=rent">Check Again Later</Link>
                  </Button>
                </div>
              )}
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
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="shrink-0 relative h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-secondary/50 flex items-center justify-center">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  )}
                </div>
                <div className="space-y-4 flex-1">
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
              </div>
              <Button className="mt-8" asChild>
                <Link href="/settings/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
