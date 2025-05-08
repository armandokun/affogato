"use client";

import Image from "next/image";
import { type Message as AIMessage } from "ai";
import Markdown from "@/components/ui/markdown";

const getModelLogo = (languageModelCode?: string) => {
  if (!languageModelCode) return "/logo.png";

  if (languageModelCode.includes("openai")) return "/llm-icons/chatgpt.png";
  if (languageModelCode.includes("anthropic")) return "/llm-icons/claude.png";

  return "/llm-icons/chatgpt.png";
};

type Props = {
  message: AIMessage & { data?: { model?: string } };
  isPlaceholder?: boolean;
};

const Message = ({ message, isPlaceholder = false }: Props) => {
  const isAI = message.role === "assistant";
  const model =
    message.data && typeof message.data === "object" && "model" in message.data
      ? (message.data as { model?: string }).model
      : undefined;
  const logoSrc = getModelLogo(model);

  if (isAI) {
    return (
      <div className="flex items-start gap-2">
        <div className="rounded-full p-1 flex-shrink-0 size-8 flex items-center justify-center">
          <Image src={logoSrc} alt="AI Assistant" width={20} height={20} />
        </div>
        <span
          className={isPlaceholder ? "text-muted-foreground animate-pulse" : ""}
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
