import AssessmentPage from '@/components/pages/assessment-page'
import { requirePageSession } from '@/lib/session'

export default async function Page() {
  await requirePageSession()
  return <AssessmentPage />
}
