import StressPage from '@/components/pages/stress-page'
import { requirePageSession } from '@/lib/session'

export default async function Page() {
  await requirePageSession()
  return <StressPage />
}
