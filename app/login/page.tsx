import LoginPage from '@/components/pages/login-page'
import { redirectAuthenticatedUser } from '@/lib/session'

export default async function Page() {
  await redirectAuthenticatedUser()
  return <LoginPage />
}
