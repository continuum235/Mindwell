import MoodPage from '@/components/pages/mood-page'
import { requirePageSession } from '@/lib/session'

export default async function Page() {
  await requirePageSession()
  return <MoodPage />
}
