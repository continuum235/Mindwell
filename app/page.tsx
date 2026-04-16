import HomePage from '@/components/pages/home-page'
import { requirePageSession } from '@/lib/session'
import { getHomeSnapshot } from '@/lib/store'

export default async function Page() {
  const session = await requirePageSession()
  const snapshot = await getHomeSnapshot(session.user?.email ?? undefined)

  return <HomePage initialSnapshot={snapshot} />
}
