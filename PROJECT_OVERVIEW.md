# Delta Car - Project Overview

Delta Car is a premium vehicle marketplace platform built with Next.js 15, Tailwind CSS, and Supabase. The platform allows users to buy, sell, rent vehicles, and request maintenance services.

## Features Implemented

### 1. Authentication & User Management
- User registration and login with Supabase Auth
- User profiles with roles (buyer, seller, both)
- Profile settings page to manage account information

### 2. Buy & Sell Listings
- Create vehicle listings with detailed information
- Browse listings with filters (type, price range)
- Search functionality for brand, model, location
- Detailed listing view with seller information
- Save/favorite listings
- Support for sale-type listings with pricing

### 3. Rent Feature
- Rent listings with daily pricing
- Browse rental vehicles with filters
- Same listing system supports both sale and rent types

### 4. Maintenance Services
- Submit maintenance requests with service type selection
- Track request status (pending, accepted, completed)
- Request scheduling with preferred date/time
- View all user's maintenance requests with filtering

### 5. Dashboard
- User dashboard showing all features
- Quick access to listings, rentals, and maintenance requests
- Profile information display
- Account management links

### 6. Design System
- Custom color palette with warm earth tones (Delta Car brand colors)
- Serif fonts (Merriweather) for headings with editorial aesthetic
- Responsive layout using Tailwind CSS
- Consistent component styling with shadcn/ui

## Technology Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui
- **Fonts**: Merriweather (serif) + Geist (sans-serif)

## Project Structure

```
app/
├── (home)/                 # Homepage
│   └── page.tsx
├── auth/                   # Authentication pages
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/              # User dashboard
│   └── page.tsx
├── listings/               # Listings (buy/sell/rent)
│   ├── page.tsx           # Browse listings
│   ├── [id]/page.tsx      # Listing detail
│   └── create/page.tsx    # Create new listing
├── maintenance/            # Maintenance services
│   ├── page.tsx           # View requests
│   └── request/page.tsx   # Submit request
├── settings/              # User settings
│   └── profile/page.tsx   # Edit profile
├── layout.tsx             # Root layout
├── page.tsx               # Root redirect
└── globals.css            # Global styles & design tokens

lib/
└── supabase.ts           # Supabase client & types

public/                    # Static assets
```

## Database Schema

### Users Table
- id (UUID, Primary Key)
- email (TEXT, Unique)
- full_name, phone, city, avatar_url
- role (buyer, seller, both)
- created_at, updated_at

### Listings Table
- id (UUID, Primary Key)
- user_id (FK to users)
- type (sale, rent)
- title, description
- price (for sale), price_per_day (for rent)
- brand, model, year, mileage, color, location
- status (available, sold, rented)
- images (JSONB), specs (JSONB)
- created_at, updated_at

### Maintenance Requests Table
- id (UUID, Primary Key)
- user_id (FK to users)
- service_type, description
- preferred_date, preferred_time
- contact_phone
- status (pending, accepted, completed)
- created_at, updated_at

### Favorites Table
- id (UUID, Primary Key)
- user_id (FK to users)
- listing_id (FK to listings)
- created_at

## Color Palette

- **Primary**: Warm brown/tan (oklch(0.55 0.15 40)) - Main brand color
- **Secondary**: Light sand (oklch(0.75 0.08 65)) - Accents
- **Accent**: Rustic orange (oklch(0.62 0.12 50)) - Call-to-action elements
- **Background**: Off-white (oklch(0.98 0.01 70))
- **Foreground**: Deep brown (oklch(0.25 0.05 40))
- **Muted**: Light grays for secondary content

## Key Features by Page

### Homepage (/)
- Hero section with call-to-action
- Feature highlights
- Navigation to signup/login
- Links to browse cars and sell

### Authentication
- **Login**: Email/password authentication
- **Signup**: New account creation with name, email, password

### Listings (/listings)
- Filter by type (sale/rent)
- Price range filtering
- Search by brand, model, location
- Grid view of available listings
- Click to view details

### Listing Details (/listings/[id])
- Full vehicle information
- Image gallery placeholder
- Seller contact information
- Save to favorites functionality
- Contact seller button

### Create Listing (/listings/create)
- Form to list new vehicle
- Support for sale and rent types
- Basic vehicle details (brand, model, year, etc.)
- Description and pricing

### Dashboard (/dashboard)
- Overview of all features
- Quick links to create listings
- Access to favorites, rentals, maintenance
- Profile information display

### Maintenance (/maintenance)
- View all maintenance requests
- Filter by status
- Submit new request form
- Track service requests

### Settings (/settings/profile)
- Edit full name, phone, city
- Change account type (buyer/seller/both)
- View email (read-only)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and Anon Key
   - Get these from your Supabase project settings

3. **Database Setup**
   - The database schema is already created in Supabase
   - Tables: users, listings, maintenance_requests, favorites
   - RLS policies are configured for security

4. **Run Development Server**
   ```bash
   pnpm dev
   ```
   - Open [http://localhost:3000](http://localhost:3000)

## Authentication Flow

1. User signs up with email/password
2. Supabase Auth creates the auth user
3. User profile is created in the `users` table
4. Default role is set to "buyer"
5. User can login with credentials
6. Dashboard shows after authentication

## Styling Approach

- **Design Tokens**: Custom CSS variables in `globals.css`
- **Tailwind Classes**: Semantic utility classes (primary, secondary, muted colors)
- **Typography**: Serif fonts for headings, sans-serif for body
- **Spacing**: Consistent spacing scale using Tailwind utilities
- **Dark Mode**: Full dark mode support with custom color palette

## Future Enhancements

- Image upload for listings
- Payment integration for purchases
- Messaging between users
- Reviews and ratings
- Advanced search filters
- Listing analytics for sellers
- Email notifications
- Admin dashboard for moderation
- Mobile app version

## Deployment

The app is ready to deploy to Vercel:

1. Connect your GitHub repository
2. Add environment variables in Vercel project settings
3. Deploy automatically on git push

## Support

For issues or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
