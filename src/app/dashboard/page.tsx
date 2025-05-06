"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowUp, Clock, Globe, Paperclip } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";

import Button from "@/components/ui/button";
import { useSession } from "@/containers/SessionProvider";

const ChatPage = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
    });
  const { user } = useSession();

  const hasMessages = useMemo(
    () => messages && messages.length > 0,
    [messages]
  );

  return (
    <div
      className={`flex flex-col w-full h-full transition-all duration-300 overflow-y-auto ${
        hasMessages ? "justify-start" : "justify-center"
      }`}
    >
      {hasMessages && (
        <header className="hidden md:flex w-full items-center justify-between border-b border-border p-2 px-4 relative mb-2">
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
          <div className="flex items-center gap-2"></div>
        </header>
      )}
      <div className="flex-1 flex flex-col bg-background rounded-lg overflow-y-auto relative">
        {hasMessages && (
          <div className="flex-1 w-full max-w-2xl mx-auto px-2 sm:px-0 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 text-white ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span className="font-bold mr-2">
                  {message.role === "user" ? "You:" : "AI:"}
                </span>
                <span>{message.content}</span>
              </div>
            ))}
            {isLoading && (
              <div className="text-muted-foreground">AI is typing...</div>
            )}
            {error && <div className="text-red-500">{error.message}</div>}
          </div>
        )}
        <motion.div
          className="w-full max-w-2xl mx-auto px-2 sm:px-0 z-10 absolute left-1/2 -translate-x-1/2"
          animate={
            hasMessages
              ? { top: "auto", bottom: 32, y: 0 }
              : { top: "50%", bottom: "auto", y: "-50%" }
          }
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-full bg-background border border-[#232329] rounded-full shadow-lg p-2 px-4"
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
              type="button"
              tabIndex={-1}
            >
              <Globe className="w-5 h-5" />
            </Button>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Klausti bet ko"
              className="flex-1 bg-transparent outline-none px-2 py-3 text-lg text-white placeholder:text-muted-foreground rounded-full"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
              type="button"
              tabIndex={-1}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              className="rounded-full"
              type="submit"
              disabled={isLoading || !input.trim()}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
