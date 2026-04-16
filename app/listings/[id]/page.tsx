'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { supabase, type Listing, type User } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [seller, setSeller] = useState<User | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

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
        setIsOwner(authData.session?.user.id === listingData.user_id)

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
      router.push(`/auth/login?next=/listings/${params.id}`)
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

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // 1. Delete images from storage explicitly to prevent bucket leaks
      if (listing.images && listing.images.length > 0) {
        const pathsToDelete = listing.images.map(url => {
          const pathParts = url.split('/listings/')
          return pathParts.length > 1 ? pathParts[1] : null
        }).filter(Boolean) as string[]
        
        if (pathsToDelete.length > 0) {
          const { error: storageError } = await supabase.storage.from('listings').remove(pathsToDelete)
          if (storageError) console.error("Failed to delete images from storage:", storageError)
        }
      }

      // 2. Delete database record
      const { error: deleteError } = await supabase
        .from('listings')
        .delete()
        .eq('id', params.id)

      if (deleteError) throw deleteError

      toast.success('Listing deleted successfully')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error('Error deleting listing: ' + err.message)
      setIsDeleting(false)
    }
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
      <Navbar user={currentUser} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/listings">← Back to Listings</Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="aspect-video bg-secondary/20 rounded-lg flex items-center justify-center overflow-hidden border border-border relative cursor-pointer group">
                    {listing.images && listing.images.length > 0 ? (
                      <>
                        <Image src={listing.images[selectedImageIndex] || listing.images[0]} alt={listing.title} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Click to expand</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground">No images available</p>
                    )}
                  </div>
                </DialogTrigger>
                {listing.images && listing.images.length > 0 && (
                  <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none">
                    <DialogTitle className="sr-only">Image preview</DialogTitle>
                    <div className="aspect-video relative rounded-lg overflow-hidden shadow-2xl">
                      <Image src={listing.images[selectedImageIndex] || listing.images[0]} alt={listing.title} fill className="object-contain bg-background/95 backdrop-blur-md" />
                    </div>
                  </DialogContent>
                )}
              </Dialog>
              
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {listing.images.map((img, i) => (
                    <div 
                      key={i} 
                      className={`aspect-video rounded-md overflow-hidden border relative group cursor-pointer transition-all duration-200 ${selectedImageIndex === i ? 'border-primary ring-2 ring-primary border-transparent' : 'border-border opacity-60 hover:opacity-100'}`}
                      onClick={() => setSelectedImageIndex(i)}
                    >
                      <Image src={img} alt={`${listing.title} ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              )}
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
                      ? `${listing.price?.toLocaleString()} EGP`
                      : `${listing.price_per_day} EGP/day`}
                  </p>
                </div>
                <Button size="lg" className="w-full" asChild disabled={!seller?.phone}>
                  {seller?.phone ? (
                    <a 
                      href={`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${seller.full_name || 'there'}, I'm interested in your ${listing.year} ${listing.brand} ${listing.model} listed on Delta Car. Is it still available?`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {listing.type === 'sale' ? 'WhatsApp Seller' : 'WhatsApp to Book'}
                    </a>
                  ) : (
                    <span>Phone Unavailable</span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Seller Card */}
            {seller && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">
                    {isOwner ? 'Your Listing' : 'Seller Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isOwner ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        You are the owner of this listing.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button asChild className="w-full">
                          <Link href={`/listings/${params.id}/edit`}>Edit</Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              className="w-full"
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your listing and remove your vehicle images from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ) : (
                    <>
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
                      <Button variant="outline" className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-200" asChild disabled={!seller.phone}>
                        {seller.phone ? (
                          <a 
                            href={`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${seller.full_name || 'there'}, I'm interested in your ${listing.brand} ${listing.model} listed on Delta Car.`)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Chat on WhatsApp
                          </a>
                        ) : (
                          <span>Chat on WhatsApp</span>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
