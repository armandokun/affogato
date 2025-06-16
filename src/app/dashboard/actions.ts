import { generateText, UIMessage } from 'ai'
import { myProvider } from '@/lib/ai/providers'

export async function generateTitleFromUserMessage({ message }: { message: UIMessage }) {
  const { text: title } = await generateText({
    model: myProvider.languageModel('openai-title-model'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 5 words long
    - the title should be a summary of the user's message
    - do not use quotes or colons
    - do not use any other characters than letters and spaces`,
    prompt: JSON.stringify(message)
  })

  return title
}
