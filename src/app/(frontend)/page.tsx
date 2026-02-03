import { redirect } from 'next/navigation'

// Redirect the root to the default locale
// The middleware will handle the actual locale detection
export default function RootPage() {
  redirect('/pl')
}
