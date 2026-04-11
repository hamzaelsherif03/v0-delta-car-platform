'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Car, Wrench, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { LoadingPage } from '@/components/ui/loading-page'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeRentals: 0,
    pendingMaintenance: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
        const { count: listingsCount } = await supabase.from('listings').select('*', { count: 'exact', head: true })
        const { count: rentalsCount } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('type', 'rent')
        const { count: maintenanceCount } = await supabase.from('maintenance_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')

        setStats({
          totalUsers: usersCount || 0,
          totalListings: listingsCount || 0,
          activeRentals: rentalsCount || 0,
          pendingMaintenance: maintenanceCount || 0,
        })
      } catch (err: any) {
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <LoadingPage />
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, description: 'Registered across platform' },
    { title: 'Total Vehicles', value: stats.totalListings, icon: Car, description: 'Live database entries' },
    { title: 'Rental Fleet', value: stats.activeRentals, icon: ShieldCheck, description: 'Cars available for rent' },
    { title: 'Pending Service', value: stats.pendingMaintenance, icon: Wrench, description: 'Unresolved maintenance' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time performance metrics and system health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Welcome to the Command Center. Use the sidebar to manage specific sectors of the platform.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
