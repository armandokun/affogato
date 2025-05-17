import type { Attachment } from "ai";
import { LoaderIcon, X } from "lucide-react";

const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  onRemove?: () => void;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div
      data-testid="input-attachment-preview"
      className="flex flex-col gap-2 mb-4"
    >
      <div className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {/* Remove button */}
        {onRemove && (
          <button
            type="button"
            aria-label="Remove attachment"
            onClick={onRemove}
            className="absolute top-1 right-1 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors cursor-pointer"
            tabIndex={0}
          >
            <X className="size-4" />
          </button>
        )}
        {contentType ? (
          contentType.startsWith("image") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={name ?? "An image attachment"}
              className="rounded-md size-full object-cover"
            />
          ) : (
            <div className="" />
          )
        ) : (
          <div className="" />
        )}

        {isUploading && (
          <div
            data-testid="input-attachment-loader"
            className="animate-spin absolute text-zinc-500"
          >
            <LoaderIcon className="size-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewAttachment;
