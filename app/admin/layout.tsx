import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <Link href="/">
            <h1 className="text-2xl font-serif font-bold text-primary">Delta Admin</h1>
          </Link>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard">← Exit to Dashboard</Link>
          </Button>
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Management
            </p>
          </div>
          <Button variant="ghost" className="w-full justify-start font-medium" asChild>
            <Link href="/admin">Dashboard Overview</Link>
          </Button>
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Operations
            </p>
          </div>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/maintenance">Maintenance Requests</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/users">User Directory</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/admin/listings">Inventory Control</Link>
          </Button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-border flex items-center justify-between bg-card">
          <Link href="/">
            <h1 className="text-xl font-serif font-bold text-primary">Delta Admin</h1>
          </Link>
          <Button variant="outline" size="sm" asChild>
             <Link href="/admin/maintenance">Menu</Link>
          </Button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
