'use client'

import Image from 'next/image'
import { UIMessage } from 'ai'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/utils'
import Markdown from '@/components/ui/markdown'
import { LanguageModelCode } from '@/lib/ai/providers'
import AvatarStack from '@/components/ui/avatar-stack'
import AnimatedShinyText from '@/components/magicui/animated-shiny-text'

import AttachmentStack from '../attachment-stack/attachment-stack'
import MessageReasoning from '../message-reasoning'

const getModelLogo = (languageModelCode?: string) => {
  if (!languageModelCode) return '/logo.png'

  if (languageModelCode.includes('openai')) return '/llm-icons/chatgpt.png'
  if (languageModelCode.includes('anthropic')) return '/llm-icons/claude.png'
  if (languageModelCode.includes('gemini')) return '/llm-icons/gemini.png'
  if (languageModelCode.includes('xai')) return '/llm-icons/grok.png'

  return '/llm-icons/chatgpt.png'
}

const getToolProvider = (toolName: string) => {
  if (toolName === 'webSearch') return 'Web Search'
  if (toolName.startsWith('linear_')) return 'Linear'
  if (toolName.startsWith('notion_')) return 'Notion'
  if (toolName.startsWith('asana_')) return 'Asana'
  if (toolName.startsWith('atlassian_')) return 'Atlassian'
  return 'External Tool'
}

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'Linear':
      return '/integration-icons/linear.png'
    case 'Notion':
      return '/integration-icons/notion.png'
    case 'Asana':
      return '/integration-icons/asana.png'
    case 'Atlassian':
      return '/integration-icons/atlassian.webp'
    default:
      return '/logo.png'
  }
}

const formatToolParameters = (args: unknown) => {
  if (!args || typeof args !== 'object') return null

  const entries = Object.entries(args)
  if (entries.length === 0) return null

  return entries
    .map(([key, value]) => {
      const displayValue =
        typeof value === 'string' && value.length > 50
          ? `${value.substring(0, 50)}...`
          : String(value)

      return `${key}: ${displayValue}`
    })
    .join(', ')
}

const getCleanToolName = (toolName: string) => {
  if (
    toolName.startsWith('linear_') ||
    toolName.startsWith('notion_') ||
    toolName.startsWith('asana_') ||
    toolName.startsWith('atlassian_')
  ) {
    return toolName.substring(toolName.indexOf('_') + 1)
  }
  return toolName
}

type Props = {
  message: UIMessage
  isLoading: boolean
}

const Message = ({ message, isLoading }: Props) => {
  const isAI = message.role === 'assistant'

  const getModelCodeFromMessage = (message: UIMessage) => {
    // @ts-expect-error model_code is always being passed
    if (message.data?.model_code) {
      // @ts-expect-error model_code is always being passed
      return message.data.model_code
    }

    // @ts-expect-error model_code is always being passed
    if (message.annotations?.[0]?.model_code) {
      // @ts-expect-error model_code is always being passed
      return message.annotations[0].model_code
    }

    const modelCodePart = message.parts?.find((part) => part.type === 'data-model-code')
    // @ts-expect-error model_code is always being passed
    if (modelCodePart && 'data' in modelCodePart && modelCodePart.data?.model_code) {
      // @ts-expect-error model_code is always being passed
      return modelCodePart.data.model_code
    }

    return LanguageModelCode.OPENAI_CHAT_MODEL_FAST
  }

  const modelCode = getModelCodeFromMessage(message)

  const logoSrc = getModelLogo(modelCode)

  const attachments = message.parts?.filter((part) => part.type === 'file') || []

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}>
        <div
          className={cn('flex gap-4 w-full', {
            'mr-auto max-w-2xl': isAI,
            'max-w-[70%] ml-auto': !isAI
          })}>
          {isAI && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <Image src={logoSrc} alt="AI Assistant" width={20} height={20} />
              </div>
            </div>
          )}

          {isAI && message.parts.length === 0 && (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-4">
                <AnimatedShinyText>Thinking...</AnimatedShinyText>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {attachments.length > 0 && (
              <div className="flex flex-row justify-end gap-2">
                <AttachmentStack attachments={attachments} />
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part
              const key = `message-${message.id}-part-${index}`

              if (type === 'reasoning' && part.text?.trim().length > 0) {
                return (
                  <MessageReasoning key={key} isLoading={isLoading} reasoningText={part.text} />
                )
              }

              if (type === 'text') {
                if (isAI) {
                  return (
                    <div key={key} className={'flex flex-row gap-2 items-start'}>
                      <div className={cn('flex flex-col w-[90%] max-w-2xl [&>*:first-child]:mt-0')}>
                        <Markdown>{part.text}</Markdown>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={key} className="flex flex-row gap-2 justify-end">
                    <div className="flex flex-col bg-muted text-white px-4 py-2 rounded-xl text-left whitespace-pre-wrap">
                      {part.text}
                    </div>
                  </div>
                )
              }

              if (type === 'dynamic-tool') {
                const { input } = part
                const { toolName, toolCallId, state } = part

                if (state === 'input-streaming') {
                  return (
                    <Markdown key={`input-streaming-${toolCallId}`}>
                      {JSON.stringify(input, null, 2)}
                    </Markdown>
                  )
                }

                if (state === 'input-available') {
                  const provider = getToolProvider(toolName)
                  const providerIcon = getProviderIcon(provider)
                  const parameters = formatToolParameters(input)
                  const cleanToolName = getCleanToolName(toolName)

                  return (
                    <div
                      key={toolCallId}
                      className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2">
                        <Image
                          src={providerIcon}
                          alt={provider}
                          width={16}
                          height={16}
                          className="rounded-sm"
                        />
                        <AnimatedShinyText className="text-sm">
                          {provider}: {cleanToolName}
                        </AnimatedShinyText>
                      </div>
                      {parameters && (
                        <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded border">
                          {parameters}
                        </div>
                      )}
                    </div>
                  )
                }

                if (state === 'output-available') {
                  const { output } = part

                  if (toolName === 'webSearch') {
                    // @ts-expect-error
                    const avatars = output.map(
                      (source: { id: string; url: string; favicon: string; title: string }) => {
                        return {
                          imageUrl: source.favicon,
                          linkUrl: source.url
                        }
                      }
                    )

                    return (
                      <div
                        key={`${toolCallId}-result`}
                        className="flex flex-row gap-2 items-center">
                        <AvatarStack avatars={avatars} />
                        <p className="text-muted-foreground text-sm">Sources</p>
                      </div>
                    )
                  }

                  const provider = getToolProvider(toolName)
                  const providerIcon = getProviderIcon(provider)

                  // Clean tool name by removing provider prefix
                  const cleanToolName = getCleanToolName(toolName)

                  return (
                    <div
                      key={`${toolCallId}-result`}
                      className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Image
                        src={providerIcon}
                        alt={provider}
                        width={14}
                        height={14}
                        className="rounded-sm"
                      />
                      <span>✓ {cleanToolName} completed</span>
                    </div>
                  )
                }
              }

              // Handle AI SDK v5 typed tool calls - webSearch
              if (type === 'tool-webSearch') {
                const { toolCallId, state } = part

                if (state === 'input-available') {
                  const { input } = part
                  const provider = getToolProvider('webSearch')
                  const providerIcon = getProviderIcon(provider)
                  const parameters = formatToolParameters(input)

                  return (
                    <div
                      key={toolCallId}
                      className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2">
                        <Image
                          src={providerIcon}
                          alt={provider}
                          width={16}
                          height={16}
                          className="rounded-sm"
                        />
                        <AnimatedShinyText className="text-sm">
                          {provider}: webSearch
                        </AnimatedShinyText>
                      </div>
                      {parameters && (
                        <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded border">
                          {parameters}
                        </div>
                      )}
                    </div>
                  )
                }

                if (state === 'output-available') {
                  const { output } = part

                  // @ts-expect-error
                  if ('error' in output) {
                    return (
                      <div key={`${toolCallId}-result`} className="text-red-500 p-2 border rounded">
                        Error: {String(output.error)}
                      </div>
                    )
                  }

                  // @ts-expect-error
                  const avatars = output.map(
                    (source: { id: string; url: string; favicon: string; title: string }) => {
                      return {
                        imageUrl: source.favicon,
                        linkUrl: source.url
                      }
                    }
                  )

                  return (
                    <div key={`${toolCallId}-result`} className="flex flex-row gap-2 items-center">
                      <AvatarStack avatars={avatars} />
                      <p className="text-muted-foreground text-sm">Sources</p>
                    </div>
                  )
                }
              }
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Message
