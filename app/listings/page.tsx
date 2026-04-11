'use client'

import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { supabase, type Listing } from '@/lib/supabase'

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState(searchParams.get('type') || 'sale')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'available')
        .eq('type', type)
        .order('created_at', { ascending: false })

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%,location.ilike.%${search}%`
        )
      }

      if (minPrice) {
        query = query.gte(type === 'sale' ? 'price' : 'price_per_day', parseFloat(minPrice))
      }

      if (maxPrice) {
        query = query.lte(type === 'sale' ? 'price' : 'price_per_day', parseFloat(maxPrice))
      }

      const { data } = await query
      setListings(data || [])
      setLoading(false)
    }

    fetchListings()
  }, [search, type, minPrice, maxPrice])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                {type === 'sale' ? 'Cars for Sale' : 'Cars for Rent'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {listings.length} listing{listings.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">My Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-6">
              {/* Type Filter */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-foreground">Listing Type</h3>
                <div className="space-y-2">
                  {['sale', 'rent'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={type === t}
                        onChange={(e) => setType(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="capitalize text-sm">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-foreground">Price Range</h3>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder={type === 'sale' ? 'Min price' : 'Min per day'}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder={type === 'sale' ? 'Max price' : 'Max per day'}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <Input
                type="search"
                placeholder="Search by brand, model, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Loading listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <p className="text-muted-foreground mb-4">No listings found</p>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                      <div className="aspect-video bg-secondary/20 rounded-t-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Image Gallery</p>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-serif font-bold text-foreground">
                            {listing.brand} {listing.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {listing.year} • {listing.mileage ? `${listing.mileage.toLocaleString()} km` : 'N/A'}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {listing.description || 'No description provided'}
                        </p>
                        <div className="flex items-end justify-between pt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {listing.location || 'Location not specified'}
                            </p>
                          </div>
                          <p className="text-lg font-serif font-bold text-primary">
                            {listing.type === 'sale'
                              ? `$${listing.price?.toLocaleString()}`
                              : `$${listing.price_per_day}/day`}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
