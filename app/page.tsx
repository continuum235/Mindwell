import HomePage from '@/components/pages/home-page'
import { requirePageSession } from '@/lib/session'

export default async function Page() {
  await requirePageSession()
  return <HomePage />
}
