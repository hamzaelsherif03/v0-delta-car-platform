'use client'

import Link from 'next/link'
import { Button } from './ui/button'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <img 
                src="/logo.png" 
                alt="Delta Car Logo" 
                className="h-10 w-auto object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm" 
              />
              <h1 className="text-xl font-playfair font-bold text-primary tracking-tight">
                Delta Car
              </h1>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The premier ecosystem for vehicle acquisition, rental, and elite maintenance. Redefining automotive excellence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/listings" className="text-sm text-muted-foreground hover:text-primary transition-colors">Inventory</Link></li>
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Partner Program</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Stay Informed</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm">Join</Button>
              </div>
            </div>
            <div className="flex gap-4 opacity-60">
              <span className="hover:text-primary cursor-pointer transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg></span>
              <span className="hover:text-primary cursor-pointer transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg></span>
              <span className="hover:text-primary cursor-pointer transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg></span>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Delta Car Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] items-center text-muted-foreground uppercase tracking-widest">
            <span>Powered by Precision</span>
            <div className="w-1 h-1 bg-primary rounded-full" />
            <span>Excellence Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
