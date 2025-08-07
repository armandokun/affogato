import type { FileUIPart } from 'ai'
import { LoaderIcon, X } from 'lucide-react'

const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove
}: {
  attachment: FileUIPart
  isUploading?: boolean
  onRemove?: () => void
}) => {
  const { filename, url, mediaType } = attachment

  const isPDF = mediaType === 'application/pdf'
  const isImage = mediaType?.startsWith('image')

  return (
    <div data-testid="input-attachment-preview" className="flex flex-col gap-2 mb-4">
      <div className="group relative flex flex-col items-center justify-between rounded-lg bg-black w-[120px] h-[120px] shadow-md">
        {/* Remove button */}
        {onRemove && (
          <button
            type="button"
            aria-label="Remove attachment"
            onClick={onRemove}
            className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            tabIndex={0}>
            <X className="size-4" />
          </button>
        )}

        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt={filename ?? 'An image attachment'}
            className="rounded-md w-full h-full object-cover border border-zinc-700"
          />
        ) : isPDF ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start justify-between w-full h-full p-3 border border-zinc-700 rounded-lg"
            title={filename}>
            <span className="text-sm font-medium text-zinc-100 line-clamp-2 break-all mb-1 text-left">
              {filename ?? 'PDF'}
            </span>
            <span className="mt-auto px-2 py-1 bg-zinc-800 text-zinc-200 rounded text-xs font-semibold">
              PDF
            </span>
          </a>
        ) : (
          <div className="" />
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="animate-spin absolute text-zinc-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoaderIcon className="size-4" />
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewAttachment
