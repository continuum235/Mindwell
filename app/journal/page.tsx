import JournalPage from '@/components/pages/journal-page'
import { requirePageSession } from '@/lib/session'

export default async function Page() {
  await requirePageSession()
  return <JournalPage />
}
