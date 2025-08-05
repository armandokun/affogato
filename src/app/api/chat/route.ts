import {
  JsonToSseTransformStream,
  UIMessage,
  convertToModelMessages,
  createUIMessageStream,
  experimental_createMCPClient,
  smoothStream,
  stepCountIs,
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
  getAllIntegrations,
  updateAccessToken
} from '@/lib/db/queries'
import { ChatSDKError } from '@/lib/errors'
import { generateTitleFromUserMessage } from '@/app/dashboard/actions'
import { ChatVisibility } from '@/constants/chat'
import { webSearch } from '@/lib/ai/tools'
import { entitlementsByPlanName, PlanName } from '@/constants/user'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const {
    id,
    message,
    selectedChatModelCode
  }: {
    id: string
    message: UIMessage
    selectedChatModelCode: LanguageModelCode
  } = await request.json()

  try {
    let user = await getServerSession()

    if (!user) {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.signInAnonymously()

      if (error) {
        console.error('Error signing in anonymously:', error)

        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401
        })
      }

      if (!data.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401
        })
      }

      user = data.user
    }

    const chatId = id

    const planNamePromise = user.is_anonymous
      ? Promise.resolve('Free')
      : getPlanNameByUserId({ userId: user.id })
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
        visibility: ChatVisibility.PERMANENT
      })

      generateTitleFromUserMessage({ message })
        .then((title) => updateChatTitle({ id: chatId, title }))
        .catch(() => new ChatSDKError('bad_request:database', 'Failed to generate chat title'))
    } else {
      if (chat.user_id !== user.id) {
        return new ChatSDKError('forbidden:chat').toResponse()
      }
    }

    const mcpConfigs = {
      linear: {
        name: 'Linear',
        url: 'https://mcp.linear.app/sse'
      },
      notion: {
        name: 'Notion',
        url: 'https://mcp.notion.com/sse'
      },
      asana: {
        name: 'Asana',
        url: 'https://mcp.asana.com/sse'
      },
      atlassian: {
        name: 'Atlassian',
        url: 'https://mcp.atlassian.com/v1/sse'
      }
    }

    const userIntegrations = await getAllIntegrations({ userId: user.id })
    const availableIntegrations =
      userIntegrations?.filter(
        (integration) => mcpConfigs[integration.provider as keyof typeof mcpConfigs]
      ) || []

    const mcpClients: Array<{ close(): Promise<void> }> = []
    let mcpTools = {}

    for (const integration of availableIntegrations) {
      const config = mcpConfigs[integration.provider as keyof typeof mcpConfigs]

      if (!config) {
        console.warn(`No MCP configuration found for provider: ${integration.provider}`)

        continue
      }

      const createMCPClient = async (accessToken: string) => {
        return await experimental_createMCPClient({
          transport: {
            type: 'sse',
            url: config.url,
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          },
          onUncaughtError: (error) => {
            console.error(`${config.name} MCP client error:`, error)
          }
        })
      }

      if (!integration.access_token) {
        console.error(`${config.name} has no access token`)

        continue
      }

      try {
        const mcpClient = await createMCPClient(integration.access_token)

        try {
          const tools = await mcpClient.tools()

          const prefixedTools = Object.entries(tools).reduce(
            (acc, [toolName, toolConfig]) => {
              const prefixedName = `${integration.provider}_${toolName}`
              acc[prefixedName] = toolConfig
              return acc
            },
            {} as Record<string, unknown>
          )

          mcpTools = { ...mcpTools, ...prefixedTools }
          mcpClients.push(mcpClient)
        } catch (error) {
          console.error(`Failed to fetch ${config.name} MCP tools:`, error)
        }
      } catch (error) {
        console.error(`Failed to create ${config.name} MCP client:`, error)

        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          try {
            await updateAccessToken({
              userId: user.id,
              provider: integration.provider,
              accessToken: null
            })
          } catch (clearError) {
            console.error(`Failed to clear ${config.name} access token:`, clearError)
          }
        }
      }
    }

    saveMessage({
      chatId,
      message: {
        id: message.id,
        role: message.role,
        parts: message.parts,
        model_code: selectedChatModelCode
      }
    })

    const { longitude, latitude, city, country } = geolocation(request)

    const requestHints = {
      longitude,
      latitude,
      city,
      country
    }

    const transformedPreviousMessages: UIMessage[] = previousMessages.map((dbMessage) => ({
      id: dbMessage.id,
      role: dbMessage.role,
      parts: dbMessage.parts,
      createdAt: dbMessage.created_at
    }))

    const allUIMessages = [...transformedPreviousMessages, message]
    const modelMessages = convertToModelMessages(allUIMessages)

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const result = streamText({
          model: myProvider.languageModel(selectedChatModelCode),
          system: systemPrompt({
            selectedChatModel: selectedChatModelCode,
            requestHints
          }),
          messages: modelMessages,
          providerOptions: {
            ...(selectedChatModelCode === LanguageModelCode.ANTHROPIC_CHAT_MODEL_THINKING
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
          stopWhen: stepCountIs(5),
          experimental_transform: smoothStream({ chunking: 'word' }),
          tools: {
            webSearch,
            ...mcpTools
          },
          onFinish: async () => {
            for (const client of mcpClients) {
              try {
                await client.close()
              } catch (error) {
                console.error('Error closing MCP client:', error)
              }
            }
          }
        })

        dataStream.write({
          id: `${message.id}-model-code`,
          type: 'data-model-code',
          data: {
            model_code: selectedChatModelCode
          }
        })

        result.consumeStream()

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true
          })
        )
      },
      onFinish: async ({ responseMessage }) => {
        if (responseMessage.role !== 'assistant') return

        await saveMessage({
          chatId,
          message: {
            id: crypto.randomUUID(),
            role: responseMessage.role,
            parts: responseMessage.parts,
            model_code: selectedChatModelCode
          }
        })
      }
    })

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()))
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
