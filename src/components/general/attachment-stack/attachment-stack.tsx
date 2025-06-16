import { useState } from 'react'
import { X } from 'lucide-react'

import { Sheet, SheetContent, SheetTitle, SheetClose } from '@/components/ui/sheet/sheet'

type Attachment = {
  url: string
  name?: string
  contentType?: string
}

type Props = {
  attachments: Attachment[]
}

const maxStacked = 4
const ATTACHMENT_SIZE = 100

const AttachmentPreview = ({ attachment }: { attachment: Attachment }) => {
  const isPDF = attachment.contentType === 'application/pdf'
  const isImage = attachment.contentType?.startsWith('image')

  if (isImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={attachment.url}
        alt={attachment.name ?? 'Attachment'}
        className="w-full h-full object-cover"
      />
    )
  }

  if (isPDF) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col justify-between w-full h-full p-3"
        title={attachment.name}>
        <span className="text-sm font-medium text-zinc-100 line-clamp-2 break-all mb-1 text-left">
          {attachment.name ?? 'PDF'}
        </span>
        <span className="px-2 py-1 bg-zinc-800 text-zinc-200 rounded text-xs font-semibold self-start mt-auto">
          PDF
        </span>
      </a>
    )
  }
  return <span className="text-zinc-400 text-xs">Unknown</span>
}

const AttachmentStack = ({ attachments }: Props) => {
  const [isStackHovered, setIsStackHovered] = useState(false)
  const [showAllAttachments, setShowAllAttachments] = useState(false)

  const hasOverflow = attachments.length > maxStacked
  const visibleStacked = hasOverflow ? attachments.slice(0, maxStacked) : attachments
  const overflowCount = attachments.length - maxStacked + 1

  return (
    <>
      {attachments.length > maxStacked ? (
        <div className="relative flex flex-row justify-end gap-2 min-h-[100px]">
          <div
            className="relative"
            style={{ width: ATTACHMENT_SIZE, height: ATTACHMENT_SIZE }}
            onMouseEnter={() => setIsStackHovered(true)}
            onMouseLeave={() => setIsStackHovered(false)}>
            {visibleStacked.map((attachment, idx) => {
              const baseOffset = (visibleStacked.length - 1 - idx) * -28
              const expandedOffset = (visibleStacked.length - 1 - idx) * -(ATTACHMENT_SIZE + 8) // 100px width + 8px gap
              const rotate = idx === 0 ? -8 : idx === 1 ? 0 : 8
              const z = 10 + idx
              const transform = isStackHovered
                ? `translateX(${expandedOffset}px) rotate(0deg)`
                : `translateX(${baseOffset}px) rotate(${rotate}deg)`

              const isLabel = hasOverflow && idx === maxStacked - 1

              return (
                <div
                  key={attachment.url}
                  className={`absolute top-0 left-0 rounded-xl border border-zinc-700 shadow-md overflow-hidden bg-zinc-900 transition-all duration-300`}
                  style={{
                    width: ATTACHMENT_SIZE,
                    height: ATTACHMENT_SIZE,
                    zIndex: z,
                    transform
                  }}
                  data-idx={idx}>
                  <AttachmentPreview attachment={attachment} />
                  {isLabel && (
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 focus:outline-none cursor-pointer"
                      onClick={() => setShowAllAttachments(true)}
                      aria-label={`Show all ${attachments.length} attachments`}>
                      <span className="text-white text-xl font-bold drop-shadow">
                        +{overflowCount}
                      </span>
                    </button>
                  )}
                </div>
              )
            })}
            {!hasOverflow && visibleStacked.length > 0 && (
              <button
                type="button"
                className="absolute inset-0 w-full h-full z-30 focus:outline-none cursor-pointer"
                onClick={() => setShowAllAttachments(true)}
                aria-label={`Show all ${attachments.length} attachments`}
                style={{ left: (visibleStacked.length - 1) * 24 }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 justify-end">
          {attachments.map((attachment) => (
            <div
              key={attachment.url}
              className={`rounded-xl border border-zinc-700 shadow-md overflow-hidden bg-zinc-900 flex items-center justify-center`}
              style={{ width: ATTACHMENT_SIZE, height: ATTACHMENT_SIZE }}>
              <AttachmentPreview attachment={attachment} />
            </div>
          ))}
        </div>
      )}
      <Sheet open={showAllAttachments} onOpenChange={setShowAllAttachments}>
        <SheetContent side="right" className="max-w-lg w-full h-screen">
          <div className="flex items-center justify-between">
            <SheetTitle>Attachments ({attachments.length})</SheetTitle>
            <SheetClose asChild>
              <button
                className="ml-2 p-2 rounded-full text-white bg-zinc-800 hover:bg-zinc-700 transition flex items-center justify-center cursor-pointer"
                aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </SheetClose>
          </div>
          <div
            className="grid grid-cols-2 gap-2 mt-4 overflow-y-auto"
            style={{ maxHeight: `calc(100vh - ${ATTACHMENT_SIZE}px)` }}>
            {attachments.map((attachment) => (
              <div
                key={attachment.url}
                className="flex flex-col items-center mt-4"
                style={{ width: ATTACHMENT_SIZE }}>
                <div
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-center overflow-hidden mb-2"
                  style={{ height: ATTACHMENT_SIZE }}>
                  <AttachmentPreview attachment={attachment} />
                </div>
                <span
                  className="text-xs text-zinc-300 break-all text-center line-clamp-2"
                  style={{ maxWidth: ATTACHMENT_SIZE }}>
                  {attachment.name}
                </span>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default AttachmentStack
