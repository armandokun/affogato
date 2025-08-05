import { FormEvent, useCallback, useRef, useState } from 'react'
import { ArrowUp, Paperclip, Square } from 'lucide-react'
import { UIMessage, FileUIPart } from 'ai'
import { UseChatHelpers } from '@ai-sdk/react'

import Button from '@/components/ui/button'
import { DASHBOARD } from '@/constants/routes'
import { toast } from '@/components/ui/toast/toast'
import { LanguageModelCode, modelDropdownOptions } from '@/lib/ai/providers'
import { createClient } from '@/lib/supabase/client'
import { useSession } from '@/containers/SessionProvider'

import Icons from '../icons'
import ComposerInput from './composer-input'
import PreviewAttachment from '../preview-attachment'
import GlobalDragDrop from './global-drag-drop'
import ModelDropdown from './model-dropdown'
import SearchSourceDropdown from './search-source-dropdown'

type Message = Parameters<UseChatHelpers<UIMessage>['sendMessage']>[0]

type Props = {
  chatId: string
  sendMessage: (message: Message) => void
  status: 'ready' | 'streaming' | 'submitted' | 'error'
  stop: () => void
  hasMessages: boolean
  selectedModelCode: LanguageModelCode
  setSelectedModel: (modelCode: LanguageModelCode) => void
}

const Composer = ({
  chatId,
  hasMessages,
  selectedModelCode,
  setSelectedModel,
  status,
  sendMessage,
  stop
}: Props) => {
  const [attachments, setAttachments] = useState<FileUIPart[]>([])
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])
  const [searchSources, setSearchSources] = useState([
    {
      id: 'web',
      name: 'Web',
      description: 'Search across the entire Internet',
      enabled: true
    }
  ])
  const [input, setInput] = useState('')

  const { user, setUser } = useSession()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSourceToggle = useCallback((sourceId: string, enabled: boolean) => {
    setSearchSources((prev) =>
      prev.map((source) => (source.id === sourceId ? { ...source, enabled } : source))
    )
  }, [])

  const uploadFile = useCallback(async (file: File) => {
    if (!user) {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInAnonymously()

      if (error) {
        toast({
          type: 'error',
          description: error.message
        })

        return
      }

      setUser(data.user)
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        const { url, name, contentType } = data

        return {
          type: 'file' as const,
          url,
          mediaType: contentType,
          filename: name
        } as FileUIPart
      }
      const { error } = await response.json()
      toast({
        type: 'error',
        description: error
      })
    } catch {
      toast({
        type: 'error',
        description: 'Failed to upload file, please try again!'
      })
    }
  }, [])

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      setUploadQueue(fileArray.map((file) => file.name))
      try {
        const uploadPromises = fileArray.map((file) => uploadFile(file))
        const uploadedAttachments = await Promise.all(uploadPromises)
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        )
        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments
        ])
      } catch (error) {
        console.error('Error uploading files!', error)
      } finally {
        setUploadQueue([])
      }
    },
    [uploadFile]
  )

  const handleSubmit = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.()

    if (!input.trim()) return

    sendMessage({
      role: 'user',
      parts: [
        ...attachments.map((attachment) => ({
          type: 'file' as const,
          url: attachment.url,
          name: attachment.filename,
          mediaType: attachment.mediaType
        })),
        {
          type: 'text',
          text: input
        }
      ]
    })

    setInput('')
  }

  const submitForm = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!input.trim()) return

      if (status === 'streaming') stop()

      window.history.replaceState({}, '', `${DASHBOARD}/${chatId}`)

      handleSubmit()

      setAttachments([])
    },
    [input, status, stop, chatId, handleSubmit, attachments]
  )

  const handleAttachmentRemove = useCallback((attachment: FileUIPart) => {
    setAttachments((current) =>
      current.filter((a) => a.url !== attachment.url || a.filename !== attachment.filename)
    )
  }, [])

  return (
    <>
      <GlobalDragDrop onFilesDrop={handleFiles} />
      <form
        onSubmit={submitForm}
        className="w-[90%] max-w-2xl bg-transparent backdrop-blur-xl border border-border focus-within:border-muted-foreground rounded-lg shadow-lg p-4 absolute bottom-6 transition-colors z-15">
        {(attachments.length > 0 || uploadQueue.length > 0) && (
          <div
            data-testid="attachments-preview"
            className="flex flex-row gap-2 overflow-x-scroll items-end">
            {attachments.map((attachment) => (
              <PreviewAttachment
                key={attachment.url || attachment.filename}
                attachment={attachment}
                onRemove={() => handleAttachmentRemove(attachment)}
              />
            ))}

            {uploadQueue.map((filename) => (
              <PreviewAttachment
                key={filename}
                attachment={{
                  type: 'file',
                  url: '',
                  filename: filename,
                  mediaType: ''
                }}
                isUploading={true}
              />
            ))}
          </div>
        )}
        <input
          type="file"
          className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
          ref={fileInputRef}
          multiple
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files)
            }
          }}
          tabIndex={-1}
        />
        {!hasMessages && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 items-center flex flex-row gap-2">
            <Icons.logo className="size-10 hover:animate-spin-once" />
            <p className="text-3xl font-semibold text-amber-50">Affogato</p>
          </div>
        )}
        <ComposerInput
          input={input}
          setInput={setInput}
          onImagePaste={(file) => handleFiles([file])}
        />
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <ModelDropdown
              selectedModelCode={selectedModelCode}
              setSelectedModel={setSelectedModel}
              modelDropdownOptions={modelDropdownOptions}
            />
          </div>
          <div className="flex items-center gap-2">
            <SearchSourceDropdown sources={searchSources} onSourceToggle={handleSourceToggle} />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
              type="button"
              tabIndex={-1}
              onClick={() => fileInputRef.current?.click()}
              disabled={status !== 'ready'}>
              <Paperclip className="size-5" />
            </Button>
            {status === 'streaming' || status === 'submitted' ? (
              <Button size="icon" className="rounded-full" type="button" onClick={stop}>
                <Square className="size-4" fill="black" />
              </Button>
            ) : (
              <Button size="icon" className="rounded-full" type="submit" disabled={!input.trim()}>
                <ArrowUp className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  )
}

export default Composer
