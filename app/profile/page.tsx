import ProfilePage from '@/components/pages/profile-page'
import { requirePageSession } from '@/lib/session'

export default async function Page() {
  await requirePageSession()
  return <ProfilePage />
}
