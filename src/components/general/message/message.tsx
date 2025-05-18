"use client";

import Image from "next/image";
import { UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import Markdown from "@/components/ui/markdown";
import { LanguageModelCode } from "@/lib/ai/providers";

import AttachmentStack from "../attachment-stack/attachment-stack";

const getModelLogo = (languageModelCode?: string) => {
  if (!languageModelCode) return "/logo.png";

  if (languageModelCode.includes("openai")) return "/llm-icons/chatgpt.png";
  if (languageModelCode.includes("anthropic")) return "/llm-icons/claude.png";
  if (languageModelCode.includes("gemini")) return "/llm-icons/gemini.png";

  return "/llm-icons/chatgpt.png";
};

type Props = {
  message: UIMessage;
};

const Message = ({ message }: Props) => {
  const isAI = message.role === "assistant";

  const modelCode =
    // @ts-expect-error model_code is always being passed
    message.data?.model_code ||
    // @ts-expect-error model_code is always being passed
    message.annotations?.[0].model_code ||
    LanguageModelCode.OPENAI_CHAT_MODEL_FAST;

  const logoSrc = getModelLogo(modelCode);

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn("flex gap-4 w-full", {
            "mr-auto max-w-2xl w-fit": isAI,
            "max-w-[70%] ml-auto": !isAI,
          })}
        >
          {isAI && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <Image
                  src={logoSrc}
                  alt="AI Assistant"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          )}

          {isAI && message.parts.length === 0 && (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-4 text-muted-foreground">
                Thinking...
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {message.experimental_attachments &&
              message.experimental_attachments.length > 0 && (
                <div className="flex flex-row justify-end gap-2">
                  <AttachmentStack
                    attachments={message.experimental_attachments}
                  />
                </div>
              )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "text") {
                if (isAI) {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="flex flex-col gap">
                        <Markdown>{part.text}</Markdown>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={key} className="flex flex-row gap-2 justify-end">
                    <div className="flex flex-col gap-4 bg-muted text-white px-4 py-2 rounded-xl text-left">
                      {part.text}
                    </div>
                  </div>
                );
              }

              if (type === "tool-invocation") {
                const { toolInvocation } = part;
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "call") {
                  return (
                    <div key={toolCallId}>
                      {toolName === "webSearch" && (
                        <h3 className="text-muted-foreground animate-pulse">
                          Web Search
                        </h3>
                      )}
                    </div>
                  );
                }

                if (state === "result") {
                  const { result } = toolInvocation;

                  if (toolName === "webSearch") {
                    return (
                      <div
                        key={`${toolCallId}-result`}
                        className="flex flex-row gap-2 items-center"
                      >
                        {result.map(
                          (source: {
                            id: string;
                            url: string;
                            favicon: string;
                            title: string;
                          }) => {
                            return (
                              <div key={source.id}>
                                <div className="flex flex-row gap-2">
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={source.favicon}
                                      alt={source.title}
                                      className="size-8 rounded-full border border-muted bg-white"
                                    />
                                  </a>
                                </div>
                              </div>
                            );
                          }
                        )}
                        <p className="text-muted-foreground">Sources</p>
                      </div>
                    );
                  }
                }
              }
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Message;
