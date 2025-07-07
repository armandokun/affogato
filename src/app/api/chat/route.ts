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
  getOAuthTokensFromProvider
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

    // Get OAuth tokens for all supported integrations
    const [linearTokens, notionTokens, asanaTokens] = await Promise.all([
      getOAuthTokensFromProvider({ userId: user.id, provider: 'linear' }),
      getOAuthTokensFromProvider({ userId: user.id, provider: 'notion' }),
      getOAuthTokensFromProvider({ userId: user.id, provider: 'asana' })
    ]);

    const mcpClients: Array<{ close(): Promise<void> }> = []
    let mcpTools = {}
    const expiredProviders: string[] = []

    // Create Linear MCP client if tokens are available
    if (linearTokens) {
      console.log('Creating Linear MCP client')

      try {
        const linearMcpClient = await experimental_createMCPClient({
          transport: {
            type: 'sse',
            url: 'https://mcp.linear.app/sse',
            headers: {
              Authorization: `Bearer ${linearTokens.accessToken}`
            }
          },
          onUncaughtError: (error) => {
            console.error('Linear MCP client error:', error)
          }
        })

        try {
          const linearTools = await linearMcpClient.tools()
          mcpTools = { ...mcpTools, ...linearTools }
          mcpClients.push(linearMcpClient)
          console.log('Linear MCP tools loaded:', Object.keys(linearTools).length)
        } catch (error) {
          console.error('Failed to fetch Linear MCP tools:', error)
          // Check if error is related to authorization
          if (error && typeof error === 'object' && 'message' in error) {
            const errorMessage = String(error.message).toLowerCase()
            if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('auth')) {
              expiredProviders.push('Linear')
            }
          }
        }
      } catch (error) {
        console.error('Failed to create Linear MCP client:', error)
        // Check if error is related to authorization
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = String(error.message).toLowerCase()
          if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('auth')) {
            expiredProviders.push('Linear')
          }
        }
      }
    } else {
      console.log('No Linear tokens found')
    }

    // Create Notion MCP client if tokens are available
    if (notionTokens) {
      console.log('Creating Notion MCP client')

      try {
        const notionMcpClient = await experimental_createMCPClient({
          transport: {
            type: 'sse',
            url: 'https://mcp.notion.com/sse',
            headers: {
              Authorization: `Bearer ${notionTokens.accessToken}`
            }
          },
          onUncaughtError: (error) => {
            console.error('Notion MCP client error:', error)
          }
        })

        try {
          const notionTools = await notionMcpClient.tools()
          mcpTools = { ...mcpTools, ...notionTools }
          mcpClients.push(notionMcpClient)
          console.log('Notion MCP tools loaded:', Object.keys(notionTools).length)
        } catch (error) {
          console.error('Failed to fetch Notion MCP tools:', error)
          // Check if error is related to authorization
          if (error && typeof error === 'object' && 'message' in error) {
            const errorMessage = String(error.message).toLowerCase()
            if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('auth')) {
              expiredProviders.push('Notion')
            }
          }
        }
      } catch (error) {
        console.error('Failed to create Notion MCP client:', error)
        // Check if error is related to authorization
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = String(error.message).toLowerCase()
          if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('auth')) {
            expiredProviders.push('Notion')
          }
        }
      }
    } else {
      console.log('No Notion tokens found')
    }

    // Create Asana MCP client if tokens are available
    if (asanaTokens) {
      console.log('Creating Asana MCP client')

      try {
        const asanaMcpClient = await experimental_createMCPClient({
          transport: {
            type: 'sse',
            url: 'https://mcp.asana.com/sse',
            headers: {
              Authorization: `Bearer ${asanaTokens.accessToken}`
            }
          },
          onUncaughtError: (error) => {
            console.error('Asana MCP client error:', error)
          }
        })

        try {
          const asanaTools = await asanaMcpClient.tools()
          mcpTools = { ...mcpTools, ...asanaTools }
          mcpClients.push(asanaMcpClient)
          console.log('Asana MCP tools loaded:', Object.keys(asanaTools).length)
        } catch (error) {
          console.error('Failed to fetch Asana MCP tools:', error)
          // Check if error is related to authorization
          if (error && typeof error === 'object' && 'message' in error) {
            const errorMessage = String(error.message).toLowerCase()
            if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('auth')) {
              expiredProviders.push('Asana')
            }
          }
        }
      } catch (error) {
        console.error('Failed to create Asana MCP client:', error)
        // Check if error is related to authorization
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = String(error.message).toLowerCase()
          if (errorMessage.includes('unauthorized') || errorMessage.includes('token') || errorMessage.includes('auth')) {
            expiredProviders.push('Asana')
          }
        }
      }
    } else {
      console.log('No Asana tokens found')
    }

    console.log('Total MCP tools available:', Object.keys(mcpTools).length)
    if (expiredProviders.length > 0) {
      console.log('Providers with expired tokens:', expiredProviders)
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

    // Add system message about expired integrations if any
    let updatedSystemPrompt = systemPrompt({
      selectedChatModel: lastSelectedModelCode,
      requestHints
    })

    if (expiredProviders.length > 0) {
      updatedSystemPrompt += `\n\nIMPORTANT: Some integrations have expired tokens and are not available: ${expiredProviders.join(', ')}. If the user asks to use these services, let them know their tokens have expired and they need to re-authenticate by visiting the integrations page in their dashboard.`
    }

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeMessageAnnotation({
          model_code: lastSelectedModelCode
        })

        const result = streamText({
          model: myProvider.languageModel(lastSelectedModelCode),
          system: updatedSystemPrompt,
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
            // Close all MCP clients
            for (const client of mcpClients) {
              try {
                await client.close()
              } catch (error) {
                console.error('Error closing MCP client:', error)
              }
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
