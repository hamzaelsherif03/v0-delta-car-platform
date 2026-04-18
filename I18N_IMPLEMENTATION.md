# Arabic i18n Implementation Guide

## Overview

This document outlines the complete implementation of Arabic language support (i18n) for the Delta Car platform. The implementation follows Next.js best practices and provides full RTL (Right-to-Left) support with seamless language switching.

## Architecture

### Translation System
- **Translation Files**: Located in `/locales/`
  - `en.json` - English translations
  - `ar.json` - Arabic translations (Egyptian Arabic)
- **Keys Structure**: Organized by feature/page for maintainability
  - `nav.*` - Navigation items
  - `hero.*` - Hero section
  - `scale.*` - Scale indicators
  - `lifestyle.*` - Lifestyle categories
  - `features.*` - Feature descriptions
  - `services.*` - Service descriptions
  - `auth.*` - Authentication pages
  - `dashboard.*` - Dashboard strings
  - `listings.*` - Listings page
  - `common.*` - Common UI elements

### Core Components

#### 1. **useTranslation Hook** (`/lib/useTranslation.ts`)
Client-side hook that:
- Detects locale from pathname (checks if `/ar` prefix is present)
- Provides `t()` function for translating keys
- Returns current `locale` for conditional rendering
- Usage:
```tsx
const { t, locale } = useTranslation()
return <h1>{t('hero.browseCars')}</h1>
```

#### 2. **LanguageToggle Component** (`/components/LanguageToggle.tsx`)
- Pill-shaped toggle button in navbar
- Persists user preference in localStorage
- Switches between `/path` (English) and `/ar/path` (Arabic)
- Integrates with Cairo font for Arabic display
- Uses `useRouter` and `usePathname` hooks

#### 3. **LocaleProvider Component** (`/components/LocaleProvider.tsx`)
- Wraps entire app in root layout
- Sets `dir` attribute on `<html>` element dynamically
- Applies RTL styles for Arabic pages
- Handles initial locale detection

#### 4. **Updated Layout** (`/app/layout.tsx`)
- Imports Cairo font from Google Fonts
- Adds Cairo CSS variable to Tailwind theme
- Wraps children with LocaleProvider for dynamic locale handling

### Routing Strategy

#### English Routes (Default)
- `/` → Home page (English)
- `/listings` → Listings page (English)
- `/auth/login` → Login page (English)
- All routes are standard Next.js routes

#### Arabic Routes
- `/ar/` → Home page (Arabic) - redirects to English home with locale detection
- `/ar/listings` → Listings page (Arabic)
- `/ar/auth/login` → Login page (Arabic)
- Created via route reexports in `/app/ar/[page]/page.tsx`
- Uses `export { default } from '../[page]'` pattern to share components

### RTL Implementation

#### CSS/Tailwind Utilities
- Added `dir="rtl"` attribute dynamically via LocaleProvider
- Used `rtl:` prefix for RTL-specific utilities:
  ```tsx
  <div className="flex rtl:flex-row-reverse">
  <div className="text-right rtl:text-left">
  ```
- Flexbox with RTL support for natural layout flipping
- Icon and arrow directions handled via conditional CSS

#### HTML/Content Direction
- `<html lang="ar" dir="rtl">` for Arabic pages
- `<html lang="en" dir="ltr">` for English pages
- `dir="rtl"` on input fields in Arabic mode

### Font Configuration

#### Cairo Font
- Added to `next.config.mjs` via Google Fonts import
- Applied globally for Arabic text via CSS variable:
  ```css
  html[lang="ar"] {
    @apply font-cairo;
  }
  ```
- Ensures proper Arabic typography and ligatures

## Implementation Checklist

### Phase 1: Core Setup ✅
- [x] Create translation files (en.json, ar.json)
- [x] Create useTranslation hook
- [x] Create LanguageToggle component
- [x] Create LocaleProvider component
- [x] Update layout with Cairo font and provider

### Phase 2: Component Updates ✅
- [x] Update Navbar with translations and toggle
- [x] Update Footer with translations
- [x] Update auth pages (login, signup)
- [x] Update home page hero section
- [x] Update home page scale section
- [x] Update home page lifestyle section
- [x] Update home page features section
- [x] Update home page services section

### Phase 3: Routing Setup ✅
- [x] Create /ar route structure
- [x] Create /ar/[page] reexports for all pages
- [x] Add locale detection in useTranslation hook

### Phase 4: RTL Support ✅
- [x] Add RTL utilities to globals.css
- [x] Update all flex containers with rtl: prefixes
- [x] Add locale-aware href handling in components
- [x] Apply Cairo font to RTL content

## Usage Guide

### Using Translations in Components

```tsx
'use client'

import { useTranslation } from '@/lib/useTranslation'

export function MyComponent() {
  const { t, locale } = useTranslation()
  
  return (
    <div>
      {/* Simple translation */}
      <h1>{t('nav.inventory')}</h1>
      
      {/* Conditional rendering based on locale */}
      {locale === 'ar' && <p>مرحبا</p>}
      
      {/* Localized href */}
      <Link href={locale === 'ar' ? '/ar/listings' : '/listings'}>
        {t('nav.browse')}
      </Link>
    </div>
  )
}
```

### Adding New Translation Keys

1. Add key to both `en.json` and `ar.json`:
```json
{
  "myFeature": {
    "title": "English Title",
    "description": "English Description"
  }
}
```

2. Use in component:
```tsx
const { t } = useTranslation()
return <h1>{t('myFeature.title')}</h1>
```

### RTL Styling

Use Tailwind's `rtl:` prefix for RTL-specific styles:
```tsx
<div className="flex justify-start rtl:justify-end">
  <span className="mr-4 rtl:mr-0 rtl:ml-4">Icon</span>
  Text
</div>
```

## Testing Checklist

- [ ] Toggle between English and Arabic on home page
- [ ] Verify all visible text translates correctly
- [ ] Check RTL layout on Arabic pages
  - [ ] Navigation items right-aligned
  - [ ] Icons and arrows not flipped
  - [ ] Form inputs have `dir="rtl"`
- [ ] Verify language preference persists on page reload
- [ ] Test on mobile responsiveness for both languages
- [ ] Check accessibility (aria-labels translated)
- [ ] Verify localhost at `/ar/*` routes shows Arabic
- [ ] Check translation for edge cases (empty states, errors)

## File Structure

```
/vercel/share/v0-project
├── locales/
│   ├── en.json          # English translations
│   └── ar.json          # Arabic translations
├── lib/
│   └── useTranslation.ts   # Translation hook
├── components/
│   ├── LanguageToggle.tsx  # Toggle button
│   ├── LocaleProvider.tsx  # Locale context wrapper
│   ├── Navbar.tsx          # Updated with i18n
│   └── Footer.tsx          # Updated with i18n
├── app/
│   ├── layout.tsx          # Root layout with Cairo font
│   ├── (home)/page.tsx     # Home page with i18n
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── ar/                 # Arabic route reexports
│       ├── page.tsx
│       ├── listings/
│       ├── auth/
│       └── [more routes...]
└── I18N_IMPLEMENTATION.md  # This file
```

## Migration Guide for Existing Pages

### Before (Hardcoded)
```tsx
<h1>Browse Cars</h1>
<p>Enter your email</p>
```

### After (Translated)
```tsx
const { t, locale } = useTranslation()

<h1>{t('hero.browseCars')}</h1>
<p>{t('auth.email')}</p>
```

## Browser Support

- Modern browsers with dynamic `dir` attribute support
- localStorage for preference persistence
- CSS custom properties for font variables
- ES6+ features (arrow functions, destructuring, optional chaining)

## Performance Considerations

1. **Translation Files**: Loaded as static JSON imports (0 additional requests)
2. **Client-Side Rendering**: `useTranslation` runs in browser only
3. **Route Switching**: Single router.push() call, no full page reload needed
4. **Font Loading**: Cairo font loaded once via Google Fonts (cached by browser)
5. **CSS RTL**: Applied via CSS classes, no JavaScript overhead

## Known Limitations

1. Server-side locale detection not implemented (future enhancement with middleware)
2. No automatic locale detection from browser language preference (localStorage only)
3. Arabic translations use Egyptian Arabic dialect (can be customized)
4. No pluralization rules (all keys are singular)

## Future Enhancements

1. Add middleware for automatic locale routing based on Accept-Language header
2. Implement pluralization rules for Arabic (singular/dual/plural)
3. Add date/number formatting (ar-EG locale)
4. Dynamic translation loading (lazy-loaded JSON per page)
5. Translator management UI for admin panel
6. SEO optimization with hreflang tags for each language variant
7. Currency and unit conversion (metric vs imperial)
8. RTL-aware form validation messages

## Debugging

### Issue: Translations not showing
1. Check if key exists in both JSON files
2. Verify JSON syntax is valid
3. Check browser console for useTranslation errors
4. Ensure component uses 'use client' directive

### Issue: RTL not working
1. Check if LocaleProvider is wrapping the app
2. Verify `dir` attribute is set on `<html>` element
3. Check if `rtl:` Tailwind utilities are present
4. Verify Cairo font is imported and applied

### Issue: Language not toggling
1. Check LanguageToggle is rendered in Navbar
2. Verify router.push() is being called
3. Check localStorage for preference persistence
4. Verify /ar routes exist in file structure

## Support & Questions

For issues or questions about the i18n implementation:
1. Check this guide first
2. Review existing component examples
3. Check translation JSON files for key names
4. Test in browser DevTools console with `localStorage.getItem('preferredLanguage')`

