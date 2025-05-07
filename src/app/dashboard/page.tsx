"use client";

import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { ArrowUp, Clock, Globe, Paperclip } from "lucide-react";

import Button from "@/components/ui/button";
import { useSession } from "@/containers/SessionProvider";

const ChatPage = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
    });
  const { user } = useSession();

  const hasMessages = messages.length > 0;

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
        className="transition-all duration-300 overflow-y-auto mb-10"
        initial={false}
        animate={
          hasMessages
            ? { height: "90%", overflowY: "auto" }
            : { height: "50%", overflow: "hidden" }
        }
        transition={{
          duration: 0,
        }}
      >
        {hasMessages && (
          <div className="w-full max-w-2xl mx-auto px-0 md:px-2 py-4 mb-10">
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
      </motion.main>
      <footer className="flex items-center justify-center p-2 pt-0 px-4 relative min-h-[40px]">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 w-full max-w-2xl bg-background border border-[#232329] rounded-full shadow-lg p-2 px-4 absolute bottom-2"
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground"
            type="button"
            tabIndex={-1}
          >
            <Globe className="size-5" />
          </Button>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Klausti bet ko"
            className="flex-1 outline-none px-2 py-3 text-md text-white placeholder:text-muted-foreground rounded-full"
            disabled={isLoading}
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
          <Button
            size="icon"
            className="rounded-full"
            type="submit"
            disabled={isLoading || !input.trim()}
          >
            <ArrowUp className="size-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
