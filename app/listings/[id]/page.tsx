'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, type Listing, type User } from '@/lib/supabase'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [seller, setSeller] = useState<User | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData } = await supabase.auth.getSession()
      setCurrentUser(authData.session?.user || null)

      const { data: listingData } = await supabase
        .from('listings')
        .select('*')
        .eq('id', params.id)
        .single()

      if (listingData) {
        setListing(listingData as Listing)

        const { data: sellerData } = await supabase
          .from('users')
          .select('*')
          .eq('id', listingData.user_id)
          .single()

        setSeller(sellerData as User)

        if (authData.session?.user) {
          const { data: favData } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', authData.session.user.id)
            .eq('listing_id', params.id)
            .single()

          setIsFavorite(!!favData)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [params.id])

  const toggleFavorite = async () => {
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('listing_id', params.id)
    } else {
      await supabase.from('favorites').insert({
        user_id: currentUser.id,
        listing_id: params.id,
      })
    }

    setIsFavorite(!isFavorite)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!listing) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Listing not found</p>
          <Button asChild>
            <Link href="/listings">Back to Listings</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/listings">← Back to Listings</Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="aspect-video bg-secondary/20 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Image Gallery Placeholder</p>
            </div>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-serif">
                      {listing.brand} {listing.model}
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">{listing.title}</p>
                  </div>
                  <Button
                    variant={isFavorite ? 'default' : 'outline'}
                    onClick={toggleFavorite}
                  >
                    {isFavorite ? '♥ Saved' : '♡ Save'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Year', value: listing.year },
                    { label: 'Mileage', value: listing.mileage ? `${listing.mileage.toLocaleString()} km` : 'N/A' },
                    { label: 'Color', value: listing.color || 'N/A' },
                    { label: 'Location', value: listing.location || 'N/A' },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-xs text-muted-foreground uppercase">
                        {item.label}
                      </p>
                      <p className="font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {listing.description && (
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-3">
                      Description
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                {Object.keys(listing.specs || {}).length > 0 && (
                  <div>
                    <h3 className="font-serif font-bold text-foreground mb-3">
                      Specifications
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(listing.specs || {}).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground uppercase">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="font-semibold text-foreground">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="border-2 border-primary">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {listing.type === 'sale' ? 'Asking Price' : 'Daily Rate'}
                  </p>
                  <p className="text-4xl font-serif font-bold text-primary">
                    {listing.type === 'sale'
                      ? `$${listing.price?.toLocaleString()}`
                      : `$${listing.price_per_day}/day`}
                  </p>
                </div>
                <Button size="lg" className="w-full">
                  {listing.type === 'sale' ? 'Contact Seller' : 'Book Now'}
                </Button>
              </CardContent>
            </Card>

            {/* Seller Card */}
            {seller && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Seller Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold text-foreground">
                      {seller.full_name || 'Anonymous'}
                    </p>
                  </div>
                  {seller.city && (
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground">{seller.city}</p>
                    </div>
                  )}
                  {seller.phone && (
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${seller.phone}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {seller.phone}
                      </a>
                    </div>
                  )}
                  <Button variant="outline" className="w-full">
                    Contact Seller
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
