"use client";

import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { ArrowUp, Clock, Paperclip, Square } from "lucide-react";
import { useRef, useEffect, useId, useState } from "react";
import Image from "next/image";

import Button from "@/components/ui/button";
import { useSession } from "@/containers/SessionProvider";
import Message from "@/components/general/message";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import Composer from "@/components/general/composer";

import { cn, setCookie } from "@/lib/utils";
import { LanguageModelCode, modelDropdownOptions } from "@/lib/ai/providers";
import Icons from "@/components/general/icons";

const COOKIE_NAME = "affogato_selected_model";

type Props = {
  initialModel: LanguageModelCode;
};

const ChatPage = ({ initialModel }: Props) => {
  const {
    messages,
    input,
    append,
    error,
    status,
    stop,
    setMessages,
    setInput,
  } = useChat({
    api: "/api/chat",
  });
  const [selectedModel, setSelectedModel] =
    useState<LanguageModelCode>(initialModel);
  const [messageModels, setMessageModels] = useState<{ [id: string]: string }>(
    {}
  );

  const mainRef = useRef<HTMLDivElement | null>(null);
  const userMessageQueue = useRef<string[]>([]);

  const { user } = useSession();
  const placeholderId = useId();

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

    if (status === "streaming") {
      stop();
    }

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
              <Clock className="size-4" />1 sec. ago
            </span>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <p className="font-semibold text-sm truncate md:max-w-[250px] lg:max-w-[450px]">
              {messages[0].content}
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
              hasMessages && "mb-14"
            )}
          >
            {messages.map((message, id) => {
              const isLast = id === messages.length - 1;
              const isAI = message.role !== "user";
              const isPlaceholder = message.id === placeholderId;
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
      <footer className="flex items-center justify-center p-2 pt-0 px-4 relative min-h-[60px]">
        <form
          onSubmit={handleSend}
          className="w-full max-w-2xl bg-background border border-border focus-within:border-muted-foreground rounded-lg shadow-lg p-4 absolute bottom-6 transition-colors"
        >
          {!hasMessages && (
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 items-center flex flex-row gap-2">
              <Icons.logo className="size-10 hover:animate-spin-once" />
              <p className="text-3xl font-semibold text-amber-50">Affogato</p>
            </div>
          )}
          <Composer input={input} setInput={setInput} />
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
                    {selectedModel && (
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
                    )}
                    {
                      modelDropdownOptions.find(
                        (opt) => opt.value === selectedModel
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
      </footer>
    </div>
  );
};

export default ChatPage;
