import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import { ArrowUp, Paperclip, Square } from "lucide-react";
import Image from "next/image";
import { UseChatHelpers } from "@ai-sdk/react";
import { Attachment } from "ai";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import Button from "@/components/ui/button";
import { toast } from "@/components/ui/toast/toast";

import { setCookie } from "@/lib/utils";
import { LanguageModelCode, modelDropdownOptions } from "@/lib/ai/providers";

import Icons from "../icons";
import ComposerInput from "./composer-input";
import PreviewAttachment from "../preview-attachment";

const COOKIE_NAME = "affogato_selected_model";

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

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
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
    <form
      onSubmit={submitForm}
      className="w-full max-w-2xl bg-background border border-border focus-within:border-muted-foreground rounded-lg shadow-lg p-4 absolute bottom-6 transition-colors z-20"
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
        onChange={handleFileChange}
        tabIndex={-1}
      />
      {!hasMessages && (
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 items-center flex flex-row gap-2">
          <Icons.logo className="size-10 hover:animate-spin-once" />
          <p className="text-3xl font-semibold text-amber-50">Affogato</p>
        </div>
      )}
      <ComposerInput input={input} setInput={setInput} />
      <div className="flex items-center justify-between gap-2 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <button
                type="button"
                className={
                  "bg-muted text-white text-sm rounded-full px-4 py-2 outline-none flex items-center gap-2 cursor-pointer transition-opacity"
                }
              >
                {selectedModelCode && (
                  <Image
                    src={
                      modelDropdownOptions.find(
                        (opt) => opt.value === selectedModelCode
                      )?.logo || ""
                    }
                    alt="Model logo"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                )}
                {
                  modelDropdownOptions.find(
                    (opt) => opt.value === selectedModelCode
                  )?.label
                }
                <span className="ml-2">&#9662;</span>
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-72">
            {modelDropdownOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => {
                  setSelectedModel(option.value);
                  setCookie(COOKIE_NAME, option.value);
                }}
                className="flex items-center gap-4 cursor-pointer mb-1"
              >
                <Image
                  src={option.logo}
                  alt={`${option.label} logo`}
                  width={20}
                  height={20}
                  className="inline-block"
                />
                <div>
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
  );
};

export default Composer;
