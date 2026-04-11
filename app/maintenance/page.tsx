'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, type MaintenanceRequest } from '@/lib/supabase'

export default function MaintenancePage() {
  const router = useRouter()
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all')

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData } = await supabase.auth.getSession()

      if (!authData.session) {
        router.push('/auth/login')
        return
      }

      setUser(authData.session.user)

      let query = supabase
        .from('maintenance_requests')
        .select('*')
        .eq('user_id', authData.session.user.id)

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data } = await query.order('created_at', { ascending: false })
      setRequests(data || [])
      setLoading(false)
    }

    fetchData()
  }, [router, filter])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Maintenance Services
              </h1>
              <p className="text-muted-foreground mt-1">
                Request and track vehicle maintenance services
              </p>
            </div>
            <Button asChild>
              <Link href="/maintenance/request">Submit Request</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border pb-4">
          {(['all', 'pending', 'accepted', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 capitalize font-medium text-sm transition-colors ${
                filter === f
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'All Requests' : f}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground mb-4">
              {filter === 'all'
                ? 'No maintenance requests yet'
                : `No ${filter} requests`}
            </p>
            <Button asChild>
              <Link href="/maintenance/request">Submit Your First Request</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif font-bold text-foreground text-lg">
                          {request.service_type}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      {request.description && (
                        <p className="text-muted-foreground mb-3">
                          {request.description}
                        </p>
                      )}
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">
                            Preferred Date
                          </p>
                          <p className="font-medium text-foreground">
                            {request.preferred_date || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">
                            Preferred Time
                          </p>
                          <p className="font-medium text-foreground">
                            {request.preferred_time || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">
                            Contact
                          </p>
                          <p className="font-medium text-foreground">
                            {request.contact_phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground ml-4">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
