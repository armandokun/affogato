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
  if (
    toolName.toLowerCase().includes('linear') ||
    toolName.includes('issue') ||
    toolName.includes('comment')
  )
    return 'Linear'
  if (
    toolName.toLowerCase().includes('notion') ||
    toolName.includes('page') ||
    toolName.includes('database')
  )
    return 'Notion'
  if (
    toolName.toLowerCase().includes('asana') ||
    toolName.includes('task') ||
    toolName.includes('project')
  )
    return 'Asana'
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
    default:
      return '/logo.png'
  }
}

const formatToolParameters = (args: any) => {
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

type Props = {
  message: UIMessage
  isLoading: boolean
}

const Message = ({ message, isLoading }: Props) => {
  const isAI = message.role === 'assistant'

  const modelCode =
    // @ts-expect-error model_code is always being passed
    message.data?.model_code ||
    // @ts-expect-error model_code is always being passed
    message.annotations?.[0].model_code ||
    LanguageModelCode.OPENAI_CHAT_MODEL_FAST

  const logoSrc = getModelLogo(modelCode)

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
            {message.experimental_attachments && message.experimental_attachments.length > 0 && (
              <div className="flex flex-row justify-end gap-2">
                <AttachmentStack attachments={message.experimental_attachments} />
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part
              const key = `message-${message.id}-part-${index}`

              if (type === 'reasoning') {
                return (
                  <MessageReasoning key={key} isLoading={isLoading} reasoning={part.reasoning} />
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

              if (type === 'tool-invocation') {
                const { toolInvocation } = part
                const { toolName, toolCallId, state } = toolInvocation

                if (state === 'call') {
                  const provider = getToolProvider(toolName)
                  const providerIcon = getProviderIcon(provider)
                  const parameters = formatToolParameters(toolInvocation.args)

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
                          {provider}: {toolName}
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

                if (state === 'result') {
                  const { result } = toolInvocation

                  if (toolName === 'webSearch') {
                    const avatars = result.map(
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
                      <span>✓ {toolName} completed</span>
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
