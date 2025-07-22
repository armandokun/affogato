import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createXai } from '@ai-sdk/xai'
import Badge from '@/components/ui/badge'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
})

const xai = createXai({
  apiKey: process.env.XAI_API_KEY
})

export enum LanguageModelCode {
  OPENAI_CHAT_MODEL_FAST = 'openai-chat-model-fast',
  OPENAI_CHAT_MODEL_LARGE = 'openai-chat-model-large',
  OPENAI_CHAT_MODEL_THINKING = 'openai-chat-model-thinking',
  XAI_CHAT_MODEL_THINKING = 'xai-chat-model-thinking',
  ANTHROPIC_CHAT_MODEL_FAST = 'anthropic-chat-model-fast',
  ANTHROPIC_CHAT_MODEL_LATEST = 'anthropic-chat-model-latest',
  ANTHROPIC_CHAT_MODEL_THINKING = 'anthropic-chat-model-thinking',
  OPENAI_TITLE_MODEL = 'openai-title-model',
  GEMINI_CHAT_MODEL_FAST = 'gemini-chat-model-fast'
}

export const myProvider = customProvider({
  languageModels: {
    [LanguageModelCode.OPENAI_CHAT_MODEL_FAST]: openai('gpt-4o-mini'),
    [LanguageModelCode.OPENAI_CHAT_MODEL_LARGE]: openai('gpt-4o'),
    [LanguageModelCode.ANTHROPIC_CHAT_MODEL_FAST]: anthropic('claude-3-5-haiku-latest'),
    [LanguageModelCode.ANTHROPIC_CHAT_MODEL_LATEST]: anthropic('claude-4-sonnet-20250514'),
    [LanguageModelCode.OPENAI_TITLE_MODEL]: openai('gpt-4-turbo'),
    [LanguageModelCode.GEMINI_CHAT_MODEL_FAST]: google('gemini-2.5-flash-preview-04-17'),
    [LanguageModelCode.XAI_CHAT_MODEL_THINKING]: wrapLanguageModel({
      model: xai('grok-3-mini-latest'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),
    [LanguageModelCode.OPENAI_CHAT_MODEL_THINKING]: wrapLanguageModel({
      model: openai('o3-2025-04-16'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),
    [LanguageModelCode.ANTHROPIC_CHAT_MODEL_THINKING]: wrapLanguageModel({
      model: anthropic('claude-4-sonnet-20250514'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    })
  }
})

export const modelDropdownOptions = [
  {
    value: LanguageModelCode.OPENAI_CHAT_MODEL_FAST,
    label: '4o-mini',
    description: 'Perfect for most tasks and talks like ChatGPT.',
    logo: '/llm-icons/chatgpt.png'
  },
  {
    value: LanguageModelCode.OPENAI_CHAT_MODEL_LARGE,
    label: '4o',
    description: 'Handles complex topics, excels at visual understanding.',
    logo: '/llm-icons/chatgpt.png'
  },
  {
    value: LanguageModelCode.ANTHROPIC_CHAT_MODEL_FAST,
    label: '3.5 Haiku',
    description: 'Perfect for most tasks and talks like Claude.',
    logo: '/llm-icons/claude.png'
  },
  {
    value: LanguageModelCode.ANTHROPIC_CHAT_MODEL_LATEST,
    label: 'Sonnet 4',
    description: 'High performance matched with creativity of Claude.',
    logo: '/llm-icons/claude.png'
  },
  {
    value: LanguageModelCode.GEMINI_CHAT_MODEL_FAST,
    label: '2.5 Flash',
    description: "Google's most reliable and efficient model.",
    logo: '/llm-icons/gemini.png',
    badge: <Badge variant="destructive">Integrations unavailable</Badge>
  }
]

export const thinkingModelDropdownOptions = [
  {
    value: LanguageModelCode.XAI_CHAT_MODEL_THINKING,
    label: 'Grok 3 Mini',
    description: "XAI's chat model with reasoning capabilities.",
    logo: '/llm-icons/grok.png'
  },
  {
    value: LanguageModelCode.OPENAI_CHAT_MODEL_THINKING,
    label: 'o3',
    description:
      'For STEM reasoning that excels in science, math, and coding tasks. Thinks internally before responding.',
    logo: '/llm-icons/chatgpt.png',
    badge: <Badge variant="default">Internal</Badge>
  },
  {
    value: LanguageModelCode.ANTHROPIC_CHAT_MODEL_THINKING,
    label: 'Sonnet 4 (Thinking)',
    description: 'For science, math, coding, and reasoning tasks.',
    logo: '/llm-icons/claude.png'
  }
]
