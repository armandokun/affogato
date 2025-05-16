"use client";

import Image from "next/image";
import { UIMessage } from "ai";

import { cn } from "@/lib/utils";
import Markdown from "@/components/ui/markdown";
import { LanguageModelCode } from "@/lib/ai/providers";

const getModelLogo = (languageModelCode?: string) => {
  if (!languageModelCode) return "/logo.png";

  if (languageModelCode.includes("openai")) return "/llm-icons/chatgpt.png";
  if (languageModelCode.includes("anthropic")) return "/llm-icons/claude.png";

  return "/llm-icons/chatgpt.png";
};

type Props = {
  message: UIMessage;
  isPlaceholder?: boolean;
};

const Message = ({ message, isPlaceholder = false }: Props) => {
  const isAI = message.role === "assistant";

  const modelCode =
    // @ts-expect-error model_code is always being passed
    message.data?.model_code ||
    // @ts-expect-error model_code is always being passed
    message.annotations?.[0].model_code ||
    LanguageModelCode.OPENAI_CHAT_MODEL_FAST;

  const logoSrc = getModelLogo(modelCode);

  if (isAI) {
    return (
      <div className="flex items-start gap-2 text-left">
        <div className="rounded-full p-1 flex-shrink-0 size-8 flex items-center justify-center">
          <Image src={logoSrc} alt="AI Assistant" width={20} height={20} />
        </div>
        <span
          className={cn(
            isPlaceholder
              ? "text-muted-foreground animate-pulse"
              : "[&>*:first-child]:mt-0"
          )}
        >
          <Markdown>{message.content}</Markdown>
        </span>
      </div>
    );
  }

  return (
    <div className="inline-block bg-muted text-white px-4 py-2 rounded-2xl max-w-[60%] text-left">
      {message.content}
    </div>
  );
};

export default Message;
