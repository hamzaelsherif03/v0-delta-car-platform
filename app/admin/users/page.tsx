'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Search, UserRoundX } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { LoadingPage } from '@/components/ui/loading-page'
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

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load users')
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  const handleRoleUpdate = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      toast.success('User role updated successfully')
      setUsers(current => 
        current.map(u => u.id === id ? { ...u, role: newRole } : u)
      )
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role')
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('User account deleted successfully')
      setUsers(current => current.filter(u => u.id !== id))
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user')
    }
  }

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage accounts, permissions, and roles.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search email or name..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        <div className="divide-y divide-border">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users found matching your search.</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/50 transition-colors px-6">
                <div className="space-y-1">
                  <p className="font-medium">{user.full_name || 'Anonymous User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Select
                      defaultValue={user.role}
                      onValueChange={(val) => handleRoleUpdate(user.id, val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <UserRoundX className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove <strong>{user.email}</strong> from the database. 
                          All associated listings and data will be lost. This action is irreversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
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
