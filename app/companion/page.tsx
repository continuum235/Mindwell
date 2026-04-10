import ChatPage from '@/components/pages/chat-page'
import { requirePageSession } from '@/lib/session'

export default async function Page() {
  await requirePageSession()
  return <ChatPage />
}
