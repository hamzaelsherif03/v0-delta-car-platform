import { LoadingPage } from '@/components/ui/loading-page'

/**
 * Global loading state for Next.js App Router streaming.
 * This ensures that as soon as a link is clicked, the branded loop appears,
 * eliminating the "dead period" between navigation events.
 */
export default function GlobalLoading() {
  return <LoadingPage />
}
