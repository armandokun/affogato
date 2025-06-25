import {
  UIMessage,
  appendClientMessage,
  appendResponseMessages,
  createDataStreamResponse,
  experimental_createMCPClient,
  smoothStream,
  streamText
} from 'ai'
import { NextResponse } from 'next/server'
import { geolocation } from '@vercel/functions'

import { getServerSession } from '@/lib/auth'
import { LanguageModelCode, myProvider } from '@/lib/ai/providers'
import { systemPrompt } from '@/lib/ai/prompts'
import {
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  getPlanNameByUserId,
  saveChat,
  saveMessage,
  updateChatTitle,
  getOAuthTokens
} from '@/lib/db/queries'
import { ChatSDKError, errorHandler } from '@/lib/errors'
import { generateTitleFromUserMessage } from '@/app/dashboard/actions'
import { ChatVisibility } from '@/constants/chat'
import { getTrailingMessageId } from '@/lib/utils'
import { webSearch } from '@/lib/ai/tools'
import { entitlementsByPlanName, PlanName } from '@/constants/user'

export async function POST(request: Request) {
  const {
    id,
    message,
    selectedVisibilityType,
    selectedChatModelCode
  }: {
    id: string
    message: UIMessage
    selectedChatModelCode: LanguageModelCode
    selectedVisibilityType: ChatVisibility
  } = await request.json()

  try {
    const user = await getServerSession()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    const chatId = id

    const planNamePromise = getPlanNameByUserId({ userId: user.id })
    const messageCountPromise = getMessageCountByUserId({
      id: user.id,
      differenceInHours: 24
    })
    const chatPromise = getChatById({ id: chatId })
    const previousMessagesPromise = getMessagesByChatId({ id: chatId })

    const [planName, messageCount, chat, previousMessages] = await Promise.all([
      planNamePromise,
      messageCountPromise,
      chatPromise,
      previousMessagesPromise
    ])

    const formattedPlanName = planName?.toLowerCase() as PlanName

    if (messageCount > entitlementsByPlanName[formattedPlanName].maxMessagesPerDay) {
      return new ChatSDKError('rate_limit:chat').toResponse()
    }

    if (!chat) {
      await saveChat({
        id: chatId,
        title: 'New Chat',
        visibility: selectedVisibilityType
      })

      generateTitleFromUserMessage({ message })
        .then((title) => updateChatTitle({ id: chatId, title }))
        .catch(() => new ChatSDKError('bad_request:database', 'Failed to generate chat title'))
    } else {
      if (chat.user_id !== user.id) {
        return new ChatSDKError('forbidden:chat').toResponse()
      }
    }

    const tokens = await getOAuthTokens({ userId: user.id, provider: 'linear' });

    let mcpClient = null
    let mcpTools = {}

    if (tokens) {
      console.log('Creating MCP client with Linear tokens')

      try {
        mcpClient = await experimental_createMCPClient({
          transport: {
            type: 'sse',
            url: 'https://mcp.linear.app/sse',
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          },
          onUncaughtError: (error) => {
            console.error('MCP client error:', error)
          }
        })

        try {
          mcpTools = await mcpClient.tools()
          console.log('Available MCP tools:', Object.keys(mcpTools).length)
        } catch (error) {
          console.error('Failed to fetch MCP tools:', error)
        }
      } catch (error) {
        console.error('Failed to create MCP client:', error)
        mcpClient = null
      }
    } else {
      console.log('No Linear tokens found, continuing without MCP integration')
    }

    const transformedPreviousMessages = previousMessages.map((message) => ({
      ...message,
      experimental_attachments: message.attachments || []
    }))

    const messages = appendClientMessage({
      messages: transformedPreviousMessages,
      message
    })

    const lastSelectedModelCode = selectedChatModelCode || LanguageModelCode.OPENAI_CHAT_MODEL_FAST

    saveMessage({
      chatId,
      message: {
        id: message.id,
        role: message.role,
        parts: message.parts,
        experimental_attachments: message.experimental_attachments ?? [],
        createdAt: new Date(),
        content: message.content,
        model_code: lastSelectedModelCode
      }
    })

    const { longitude, latitude, city, country } = geolocation(request)

    const requestHints = {
      longitude,
      latitude,
      city,
      country
    }

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeMessageAnnotation({
          model_code: lastSelectedModelCode
        })

        const result = streamText({
          model: myProvider.languageModel(lastSelectedModelCode),
          system: systemPrompt({
            selectedChatModel: lastSelectedModelCode,
            requestHints
          }),
          messages,
          providerOptions: {
            ...(lastSelectedModelCode === LanguageModelCode.ANTHROPIC_CHAT_MODEL_THINKING
              ? {
                  anthropic: {
                    thinking: { type: 'enabled', budgetTokens: 10000 }
                  }
                }
              : {})
          },
          headers: {
            'anthropic-beta': 'interleaved-thinking-2025-05-14'
          },
          temperature: 0.5,
          topP: 0.9,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: 'word' }),
          tools: {
            webSearch,
            ...mcpTools
          },
          onFinish: async ({ response }) => {
            if (mcpClient) {
              await mcpClient.close()
            }

            if (user.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter((message) => message.role === 'assistant')
                })

                if (!assistantId) {
                  throw new Error('No assistant message found!')
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [message],
                  responseMessages: response.messages
                })

                await saveMessage({
                  chatId,
                  message: {
                    id: assistantId,
                    role: assistantMessage.role,
                    parts: assistantMessage.parts,
                    experimental_attachments: assistantMessage.experimental_attachments ?? [],
                    content: assistantMessage.content,
                    model_code: lastSelectedModelCode
                  }
                })
              } catch (error) {
                console.error('Failed to save message', error)
              }
            }
          }
        })

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true
        })
      },
      onError: errorHandler
    })
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
