'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Search, Trash2, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LoadingPage } from '@/components/ui/loading-page'
import Link from 'next/link'
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

export default function AdminListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*, users:user_id(full_name, email)')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load listings')
    } else {
      setListings(data || [])
    }
    setLoading(false)
  }

  const handleDeleteListing = async (id: string, imageUrls: string[]) => {
    try {
      // 1. Delete associated images from storage
      if (imageUrls && imageUrls.length > 0) {
        const pathsToDelete = imageUrls.map(url => {
          const parts = url.split('/listings/')
          return parts.length > 1 ? parts[1] : null
        }).filter(Boolean) as string[]

        if (pathsToDelete.length > 0) {
          await supabase.storage.from('listings').remove(pathsToDelete)
        }
      }

      // 2. Delete the record
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Listing removed from platform')
      setListings(current => current.filter(l => l.id !== id))
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete listing')
    }
  }

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.users?.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Listing Moderation</h1>
          <p className="text-muted-foreground">Monitor and manage all vehicle advertisements.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search make, model, or seller..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        <div className="divide-y divide-border">
          {filteredListings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No listings found.</div>
          ) : (
            filteredListings.map((listing) => (
              <div key={listing.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/50 transition-colors px-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-16 w-16 rounded bg-secondary/50 overflow-hidden relative border border-border shrink-0">
                    {listing.images && listing.images[0] && (
                      <img src={listing.images[0]} className="w-full h-full object-cover" alt="Thumb" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{listing.brand} {listing.model}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[300px]">{listing.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{listing.type}</span>
                      <span>•</span>
                      <span>${listing.price?.toLocaleString() || listing.price_per_day + '/day'}</span>
                      <span>•</span>
                      <span className="font-medium text-foreground">{listing.users?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/listings/${listing.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Moderate Listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will immediately remove <strong>{listing.brand} {listing.model}</strong> from the platform. 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteListing(listing.id, listing.images || [])}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Confirm Removal
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
