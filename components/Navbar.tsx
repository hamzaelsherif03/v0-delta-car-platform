'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
  user?: any
  showDashboard?: boolean
}

export function Navbar({ user, showDashboard = true }: NavbarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group py-2">
          <img 
            src="/logo.png" 
            alt="Delta" 
            className="h-14 w-auto object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm" 
          />
          <h1 className="text-2xl font-playfair font-bold text-primary tracking-tight">
            Delta Car
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/listings" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Inventory
          </Link>
          <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {showDashboard && (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
