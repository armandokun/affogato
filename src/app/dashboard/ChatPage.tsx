"use client";

import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { useRef, useEffect, useId, useState } from "react";
import { UIMessage } from "ai";
import { redirect } from "next/navigation";

import Message from "@/components/general/message";
import Composer from "@/components/general/composer";
import { toast } from "@/components/ui/toast/toast";
import { SidebarTrigger } from "@/components/general/sidebar/sidebar";

import { PlanName } from "@/constants/user";
import { DASHBOARD_PRICING } from "@/constants/routes";
import { ChatVisibility, SELECTED_MODEL_COOKIE } from "@/constants/chat";
import {
  cn,
  fetchWithErrorHandlers,
  generateUUID,
  getCookie,
} from "@/lib/utils";
import { ChatSDKError } from "@/lib/errors";
import { LanguageModelCode } from "@/lib/ai/providers";
import { getRelativeTimeFromNow } from "@/lib/utils/date";
import useSidebar from "@/hooks/use-sidebar";
import { useSubscription } from "@/hooks/use-subscription";

type Props = {
  chatId: string;
  chatTitle: string;
  initialModel: LanguageModelCode;
  initialMessages: Array<UIMessage>;
  visibilityType: ChatVisibility;
  createdAt: string;
};

const ChatPage = ({
  chatTitle,
  visibilityType,
  initialModel,
  initialMessages,
  chatId,
  createdAt,
}: Props) => {
  const {
    messages,
    input,
    handleSubmit,
    error,
    status,
    stop,
    setMessages,
    setInput,
  } = useChat({
    api: "/api/chat",
    id: chatId,
    initialMessages,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    fetch: fetchWithErrorHandlers,
    experimental_prepareRequestBody: (body) => ({
      id: chatId,
      message: body.messages.at(-1),
      selectedChatModelCode: selectedModelCode,
      selectedVisibilityType: visibilityType,
    }),
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast({
          type: "error",
          description: error.message,
        });
      }
    },
  });
  const [selectedModelCode, setSelectedModel] =
    useState<LanguageModelCode>(initialModel);

  const mainRef = useRef<HTMLDivElement | null>(null);

  const placeholderId = useId();
  const { open, isMobile } = useSidebar();
  const { currentPlan } = useSubscription();

  useEffect(() => {
    if (!currentPlan) return;

    if (currentPlan.toLocaleLowerCase() === PlanName.FREE) {
      redirect(DASHBOARD_PRICING);
    }
  }, [currentPlan]);

  useEffect(() => {
    if (selectedModelCode !== initialModel) return;

    const cookie = getCookie(SELECTED_MODEL_COOKIE);

    if (!cookie) return;

    setSelectedModel(cookie as LanguageModelCode);
  }, [selectedModelCode, initialModel]);

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
            data: {
              model_code: selectedModelCode,
            },
          },
        ]);
      }
    } else {
      if (messages.some((m) => m.id === placeholderId)) {
        setMessages((prev) => prev.filter((m) => m.id !== placeholderId));
      }
    }
  }, [messages, placeholderId, selectedModelCode, setMessages, status]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col size-full">
      {hasMessages && (
        <header className="flex items-center justify-between border-b border-border px-4 relative h-14">
          <div className="flex items-center gap-2">
            {(!open || isMobile) && <SidebarTrigger />}
            <span className="hidden md:flex text-xs text-muted-foreground whitespace-nowrap items-center gap-1">
              <Clock className="size-4" />
              {getRelativeTimeFromNow(createdAt)}
            </span>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <p className="font-semibold text-sm truncate max-w-[200px] md:max-w-[250px] lg:max-w-[450px]">
              {chatTitle || messages[0].content}
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
        {hasMessages ? (
          <div
            className={cn(
              "w-full max-w-2xl mx-auto px-0 md:px-2 py-4",
              hasMessages && "mb-14"
            )}
          >
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              const isAI = message.role === "assistant";

              return (
                <div
                  key={message.id}
                  className={`mb-12 text-white ${
                    message.role === "user" ? "text-right" : "text-left"
                  }${isLast && isAI ? " min-h-96" : ""}`}
                >
                  <Message
                    message={message}
                    isLoading={
                      status === "streaming" && index === messages.length - 1
                    }
                  />
                </div>
              );
            })}
            {error && <div className="text-red-500">{error.message}</div>}
          </div>
        ) : (
          <div className="p-2">{(!open || isMobile) && <SidebarTrigger />}</div>
        )}
      </motion.main>
      <footer className="flex items-center justify-center p-2 pt-0 px-4 relative min-h-[60px]">
        <Composer
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          hasMessages={hasMessages}
          selectedModelCode={selectedModelCode}
          setSelectedModel={setSelectedModel}
          status={status}
          stop={stop}
        />
      </footer>
    </div>
  );
};

export default ChatPage;
