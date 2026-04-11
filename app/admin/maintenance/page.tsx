'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingPage } from '@/components/ui/loading-page'
import { toast } from 'sonner'

export default function AdminMaintenancePage() {
  const router = useRouter()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*, users:user_id(full_name, email)')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load maintenance requests')
    } else {
      setRequests(data || [])
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      toast.success('Request status updated successfully')
      
      // Update local state to reflect UI instantly
      setRequests(current => 
        current.map(req => req.id === id ? { ...req, status: newStatus } : req)
      )
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Maintenance Requests</h1>
        <p className="text-muted-foreground">Manage and track all platform service requests globally.</p>
      </div>

      <div className="rounded-md border border-border bg-card">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No maintenance requests found across the network.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((req) => (
              <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1 md:w-1/3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{req.service_type}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        req.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : req.status === 'accepted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {req.description || "No specific details provided."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Submitted: {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1 md:w-1/3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Client</span>
                    <span className="font-medium">{req.users?.full_name || 'Anonymous User'}</span>
                    <span className="text-muted-foreground">{req.users?.email}</span>
                  </div>
                  <div className="mt-2 flex gap-4">
                    <div>
                      <span className="text-muted-foreground text-xs uppercase tracking-wider block">Date</span>
                      <span>{req.preferred_date || 'Flexible'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs uppercase tracking-wider block">Time</span>
                      <span>{req.preferred_time || 'Flexible'}</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider block">Phone</span>
                    <span>{req.contact_phone}</span>
                  </div>
                </div>

                <div className="md:w-1/4 flex flex-col gap-2">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Manage Status</span>
                  <Select
                    defaultValue={req.status}
                    onValueChange={(val) => handleStatusUpdate(req.id, val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
