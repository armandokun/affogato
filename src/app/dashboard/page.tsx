"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowUp, Clock, Globe, Paperclip } from "lucide-react";
import { useMemo } from "react";

import Button from "@/components/ui/button";
import { useSession } from "@/containers/SessionProvider";

const SUGGESTIONS = [
  { label: "Summarize", value: "Can you summarize this?" },
  { label: "Idea", value: "Give me an idea." },
  { label: "Get advice", value: "I need some advice." },
  { label: "Plan", value: "Help me plan something." },
  { label: "More", value: "Show me more options." },
];

const ChatPage = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setInput,
  } = useChat({
    api: "/api/chat",
  });
  const { user } = useSession();

  const hasMessages = useMemo(
    () => messages && messages.length > 0,
    [messages]
  );

  return (
    <div
      className={`flex flex-col w-full h-full bg-[#18181b] px-4 transition-all duration-300 ${
        hasMessages ? "justify-start" : "justify-center"
      }`}
    >
      {hasMessages ? (
        <header className="hidden md:flex w-full items-center justify-between border-b border-border p-2 mb-6 relative">
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
      ) : (
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl font-semibold text-white mb-8 text-center">
            Affogato.chat
          </h1>
        </div>
      )}
      <div
        className={`w-full max-w-xl flex flex-col items-center ${
          hasMessages ? "mb-8" : "mb-0"
        } mx-auto`}
      >
        {hasMessages && (
          <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto mb-4 w-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 text-white ${
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
        <div className="flex flex-col w-full bg-background border border-[#232329] rounded-full shadow-lg p-2 px-4 gap-4">
          <form
            onSubmit={handleSubmit}
            className={`flex items-center gap-2 w-full ${
              hasMessages ? "" : "justify-center"
            }`}
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
        </div>
        {!hasMessages && (
          <div className="flex flex-wrap justify-center gap-2 mt-6 w-full">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                className="bg-[#232329] text-white rounded-full px-4 py-2 text-sm font-medium shadow hover:bg-[#2c2c31] transition"
                onClick={() => setInput(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
