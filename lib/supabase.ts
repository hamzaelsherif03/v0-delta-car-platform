import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing environment variables for Supabase. Please check your .env.local file. ' +
    'Required variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  city: string | null
  avatar_url: string | null
  role: 'buyer' | 'seller' | 'both'
  created_at: string
  updated_at: string
}

export type Listing = {
  id: string
  user_id: string
  type: 'sale' | 'rent'
  title: string
  description: string | null
  price: number | null
  price_per_day: number | null
  brand: string
  model: string
  year: number | null
  mileage: number | null
  color: string | null
  location: string | null
  status: 'available' | 'sold' | 'rented'
  images: string[]
  specs: Record<string, any>
  created_at: string
  updated_at: string
}

export type MaintenanceRequest = {
  id: string
  user_id: string
  service_type: string
  description: string | null
  preferred_date: string | null
  preferred_time: string | null
  contact_phone: string
  status: 'pending' | 'accepted' | 'completed'
  created_at: string
  updated_at: string
}

export type Favorite = {
  id: string
  user_id: string
  listing_id: string
  created_at: string
}
