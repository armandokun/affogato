"use client";

import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { ArrowUp, Clock, Paperclip, Square } from "lucide-react";
import { useRef, useEffect, useId, useState } from "react";
import Image from "next/image";

import Button from "@/components/ui/button";
import { useSession } from "@/containers/SessionProvider";
import { cn } from "@/lib/utils";
import Message from "@/components/general/message";
import { LanguageModel } from "@/lib/ai/providers";
import { modelDropdownOptions } from "@/lib/ai/providers";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu/dropdown-menu";

const ChatPage = () => {
  const {
    messages,
    input,
    handleInputChange,
    append,
    error,
    status,
    stop,
    setMessages,
    setInput,
  } = useChat({
    api: "/api/chat",
  });
  const { user } = useSession();
  const placeholderId = useId();

  const mainRef = useRef<HTMLDivElement | null>(null);

  const [selectedModel, setSelectedModel] = useState(
    LanguageModel.OPENAI_CHAT_MODEL_FAST
  );
  const [messageModels, setMessageModels] = useState<{ [id: string]: string }>(
    {}
  );
  const userMessageQueue = useRef<string[]>([]);

  useEffect(() => {
    if (!mainRef.current) return;

    mainRef.current.scrollTo({
      top: mainRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  useEffect(() => {
    if (status === "submitted") {
      if (!messages.some((m) => m.id === placeholderId)) {
        setMessages((prev) => [
          ...prev,
          {
            id: placeholderId,
            role: "assistant",
            content: "Thinking...",
          },
        ]);
      }
    } else {
      if (messages.some((m) => m.id === placeholderId)) {
        setMessages((prev) => prev.filter((m) => m.id !== placeholderId));
      }
    }
  }, [messages, placeholderId, setMessages, status]);

  const hasMessages = messages.length > 0;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setInput("");

    const tempId = `${Date.now()}-${Math.random()}`;
    userMessageQueue.current.push(tempId);

    setMessageModels((prev) => ({
      ...prev,
      [tempId]: selectedModel,
    }));

    await append({
      id: tempId,
      role: "user",
      content: input,
      data: {
        model: selectedModel,
      },
    });
  };

  const getModelForAssistantMessage = (messages: unknown[], id: number) => {
    for (let i = id - 1; i >= 0; i--) {
      const msg = messages[i] as { role?: string; id?: string };
      if (msg.role === "user" && msg.id) {
        return messageModels[msg.id];
      }
    }

    return undefined;
  };

  return (
    <div className="flex flex-col size-full">
      {hasMessages && (
        <header className="hidden md:flex items-center justify-between border-b border-border px-4 relative h-14">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.user_metadata.avatar_url}
              className="size-6 rounded-full"
              alt="avatar"
            />
            <span className="font-semibold text-white truncate max-w-[120px] text-sm">
              {user?.user_metadata.name.split(" ")[0]}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <Clock className="size-4" />
              12 sec. ago
            </span>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <p className="font-semibold text-sm">
              DoorDash announces $5 billion deals amid strong...
            </p>
          </div>
        </header>
      )}
      <motion.main
        className="transition-all duration-300 overflow-y-auto"
        initial={false}
        animate={
          hasMessages
            ? { height: "90%", overflowY: "auto" }
            : { height: "50%", overflow: "hidden" }
        }
        transition={{
          duration: 0,
        }}
        ref={mainRef}
      >
        {hasMessages && (
          <div
            className={cn(
              "w-full max-w-2xl mx-auto px-0 md:px-2 py-4",
              hasMessages && "mb-10"
            )}
          >
            {messages.map((message, id) => {
              const isLast = id === messages.length - 1;
              const isAI = message.role !== "user";
              const isPlaceholder = message.id === placeholderId;

              // For assistant messages, find the model used for the previous user message
              let modelForMessage = undefined;
              if (message.role === "assistant") {
                modelForMessage = getModelForAssistantMessage(messages, id);
              } else if (message.role === "user") {
                modelForMessage = messageModels[message.id];
              }

              return (
                <div
                  key={message.id}
                  className={`mb-4 text-white ${
                    message.role === "user" ? "text-right" : "text-left"
                  }${isLast && isAI ? " min-h-96" : ""}`}
                >
                  <Message
                    message={{
                      ...message,
                      ...(modelForMessage !== undefined
                        ? { data: { model: modelForMessage } }
                        : { data: undefined }),
                    }}
                    isPlaceholder={isPlaceholder}
                  />
                </div>
              );
            })}
            {error && <div className="text-red-500">{error.message}</div>}
          </div>
        )}
      </motion.main>
      <footer className="flex items-center justify-center p-2 pt-0 px-4 relative min-h-[40px]">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 w-full max-w-2xl bg-background border border-[#232329] rounded-full shadow-lg p-2 px-4 absolute bottom-2"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="bg-muted text-white text-sm rounded-full px-4 py-2 outline-none flex items-center gap-2 cursor-pointer"
              >
                <Image
                  src={
                    modelDropdownOptions.find(
                      (opt) => opt.value === selectedModel
                    )?.logo || ""
                  }
                  alt="Model logo"
                  width={20}
                  height={20}
                  className="inline-block"
                />
                {
                  modelDropdownOptions.find(
                    (opt) => opt.value === selectedModel
                  )?.label
                }
                <span className="ml-2">&#9662;</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-72">
              {modelDropdownOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setSelectedModel(option.value)}
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
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="How can I help you today?"
            className="flex-1 outline-none px-2 py-3 text-md text-white placeholder:text-muted-foreground rounded-full"
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground"
            type="button"
            tabIndex={-1}
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
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
