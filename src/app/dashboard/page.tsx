import { cookies } from 'next/headers'

import { generateUUID } from '@/lib/utils'
import { LanguageModelCode } from '@/lib/ai/providers'

import ChatPage from './ChatPage'

const COOKIE_NAME = 'affogato_selected_model'

const DashboardPage = async () => {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(COOKIE_NAME)?.value

  const selectedModel = Object.values(LanguageModelCode).includes(cookieValue as LanguageModelCode)
    ? (cookieValue as LanguageModelCode)
    : LanguageModelCode.OPENAI_CHAT_MODEL_FAST

  const id = generateUUID()

  return (
    <ChatPage
      chatId={id}
      chatTitle="New chat"
      createdAt={new Date().toISOString()}
      initialMessages={[]}
      initialModel={selectedModel}
    />
  )
}

export default DashboardPage
