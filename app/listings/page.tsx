'use client'

import { Suspense, useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { supabase, type Listing } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { LoadingPage } from '@/components/ui/loading-page'
import { Spinner } from '@/components/ui/spinner'

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [user, setUser] = useState<any>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [type, setType] = useState(searchParams.get('type') || 'sale')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    let ignore = false

    const fetchListings = async () => {
      setIsSearching(true)
      console.log(`[FetchListings] type: ${type}, category: "${category}", search: "${debouncedSearch}"`)

      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'available')
        .eq('type', type)

      if (category) {
        query = query.eq('category', category)
      }

      if (debouncedSearch) {
        query = query.or(
          `title.ilike.%${debouncedSearch}%,brand.ilike.%${debouncedSearch}%,model.ilike.%${debouncedSearch}%,location.ilike.%${debouncedSearch}%`
        )
      }

      if (minPrice) {
        const minVal = parseFloat(minPrice)
        if (!isNaN(minVal)) {
          query = query.gte(type === 'sale' ? 'price' : 'price_per_day', minVal)
        }
      }

      if (maxPrice) {
        const maxVal = parseFloat(maxPrice)
        if (!isNaN(maxVal)) {
          query = query.lte(type === 'sale' ? 'price' : 'price_per_day', maxVal)
        }
      }

      query = query.order('created_at', { ascending: false })

      const { data, error: fetchError } = await query

      if (!ignore) {
        if (fetchError) {
          console.error("Supabase Error Details:", JSON.stringify(fetchError, Object.getOwnPropertyNames(fetchError), 2))

          // Graceful fallback: If category column is missing, try a keyword search for the category instead
          const isColumnMissing = fetchError.code === 'PGRST204' ||
            (fetchError.message && fetchError.message.includes('column "category" does not exist'))

          if (isColumnMissing && category) {
            console.warn(`Category column missing. Falling back to keyword-based discovery for: ${category}`)
            let fallbackQuery = supabase
              .from('listings')
              .select('*')
              .eq('status', 'available')
              .eq('type', type)
              .or(`title.ilike.%${category}%,description.ilike.%${category}%,brand.ilike.%${category}%`)
              .order('created_at', { ascending: false })

            const { data: fallbackData, error: secondError } = await fallbackQuery
            if (secondError) {
              console.error("Fallback Failed:", secondError)
              setListings([])
            } else {
              setListings(fallbackData || [])
            }
          } else {
            setListings([])
          }
        } else {
          setListings(data || [])
        }
        setIsSearching(false)
        setIsInitialLoading(false)
      }
    }

    fetchListings()

    return () => {
      ignore = true
    }
  }, [debouncedSearch, type, category, minPrice, maxPrice])

  if (isInitialLoading) {
    return <LoadingPage />
  }

  return (
    <Suspense fallback={<LoadingPage />}>
      <ListingsContent
        listings={listings}
        user={user}
        isSearching={isSearching}
        type={type}
        setType={setType}
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />
    </Suspense>
  )
}

interface ListingsContentProps {
  listings: Listing[]
  user: any
  isSearching: boolean
  type: string
  setType: (t: string) => void
  category: string
  setCategory: (c: string) => void
  search: string
  setSearch: (s: string) => void
  minPrice: string
  setMinPrice: (p: string) => void
  maxPrice: string
  setMaxPrice: (p: string) => void
}

function ListingsContent({
  listings,
  user,
  isSearching,
  type,
  setType,
  category,
  setCategory,
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice
}: ListingsContentProps) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Page Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold text-foreground">
                  {type === 'sale' ? 'Cars for Sale' : 'Cars for Rent'}
                </h1>
                {category && (
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                    {category}
                    <button
                      onClick={() => setCategory('')}
                      className="hover:text-primary/70 transition-colors ml-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                  </div>
                )}
                {isSearching && (
                  <div className="flex items-center gap-2 text-primary animate-pulse text-xs font-medium bg-primary/5 px-2 py-1 rounded-full border border-primary/20">
                    <Spinner className="h-3 w-3" />
                    Searching...
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {listings.length} listing{listings.length !== 1 ? 's' : ''} available
              </p>
            </div>

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

            {isSearching && listings.length === 0 ? (
              <ListingGridSkeleton count={4} />
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
                    <Card className="h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer">
                      <div className="aspect-video bg-secondary/20 rounded-t-lg flex items-center justify-center overflow-hidden relative">
                        {listing.images && listing.images.length > 0 ? (
                          <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                        ) : (
                          <p className="text-muted-foreground text-xs">No Image</p>
                        )}
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
                              ? `${listing.price?.toLocaleString()} EGP`
                              : `${listing.price_per_day} EGP/day`}
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

function ListingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden h-[400px] animate-pulse">
          <div className="aspect-video bg-muted" />
          <div className="p-4 space-y-4">
            <div className="h-6 w-2/3 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-4/5 bg-muted rounded" />
            </div>
            <div className="pt-4 flex justify-between items-end">
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-8 w-1/4 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
