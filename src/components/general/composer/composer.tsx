import { FormEvent, useCallback, useRef, useState } from "react";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import { UseChatHelpers } from "@ai-sdk/react";
import { Attachment } from "ai";

import Button from "@/components/ui/button";
import { toast } from "@/components/ui/toast/toast";
import { LanguageModelCode, modelDropdownOptions } from "@/lib/ai/providers";

import Icons from "../icons";
import ComposerInput from "./composer-input";
import PreviewAttachment from "../preview-attachment";
import GlobalDragDrop from "./global-drag-drop";
import ModelDropdown from "./model-dropdown";

type Props = {
  chatId: string;
  input: UseChatHelpers["input"];
  setInput: UseChatHelpers["setInput"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  status: UseChatHelpers["status"];
  stop: UseChatHelpers["stop"];
  hasMessages: boolean;
  selectedModelCode: LanguageModelCode;
  setSelectedModel: (modelCode: LanguageModelCode) => void;
};

const Composer = ({
  chatId,
  input,
  setInput,
  hasMessages,
  selectedModelCode,
  setSelectedModel,
  status,
  handleSubmit,
  stop,
}: Props) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, name, contentType } = data;

        return {
          url,
          name,
          contentType,
        };
      }
      const { error } = await response.json();
      toast({
        type: "error",
        description: error,
      });
    } catch {
      toast({
        type: "error",
        description: "Failed to upload file, please try again!",
      });
    }
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      setUploadQueue(fileArray.map((file) => file.name));
      try {
        const uploadPromises = fileArray.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );
        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [uploadFile]
  );

  const submitForm = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!input.trim()) return;

      if (status === "streaming") stop();

      window.history.replaceState({}, "", `/dashboard/${chatId}`);

      handleSubmit(undefined, {
        experimental_attachments: attachments,
      });

      setAttachments([]);
    },
    [input, status, stop, chatId, handleSubmit, attachments]
  );

  const handleAttachmentRemove = useCallback((attachment: Attachment) => {
    setAttachments((current) =>
      current.filter(
        (a) => a.url !== attachment.url || a.name !== attachment.name
      )
    );
  }, []);

  return (
    <>
      <GlobalDragDrop onFilesDrop={handleFiles} />
      <form
        onSubmit={submitForm}
        className="w-[90%] max-w-2xl bg-transparent backdrop-blur-xl border border-border focus-within:border-muted-foreground rounded-lg shadow-lg p-4 absolute bottom-6 transition-colors z-15"
      >
        {(attachments.length > 0 || uploadQueue.length > 0) && (
          <div
            data-testid="attachments-preview"
            className="flex flex-row gap-2 overflow-x-scroll items-end"
          >
            {attachments.map((attachment) => (
              <PreviewAttachment
                key={attachment.url || attachment.name}
                attachment={attachment}
                onRemove={() => handleAttachmentRemove(attachment)}
              />
            ))}

            {uploadQueue.map((filename) => (
              <PreviewAttachment
                key={filename}
                attachment={{
                  url: "",
                  name: filename,
                  contentType: "",
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
              handleFiles(event.target.files);
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
          <ModelDropdown
            selectedModelCode={selectedModelCode}
            setSelectedModel={setSelectedModel}
            modelDropdownOptions={modelDropdownOptions}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
              type="button"
              tabIndex={-1}
              onClick={() => fileInputRef.current?.click()}
              disabled={status !== "ready"}
            >
              <Paperclip className="size-5" />
            </Button>
            {status === "streaming" || status === "submitted" ? (
              <Button
                size="icon"
                className="rounded-full"
                type="button"
                onClick={stop}
              >
                <Square className="size-4" fill="black" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="rounded-full"
                type="submit"
                disabled={!input.trim()}
              >
                <ArrowUp className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default Composer;
