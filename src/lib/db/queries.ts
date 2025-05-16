import { Message } from "ai";

import { ChatVisibility } from "@/constants/chat";

import { ChatSDKError } from "../errors";
import { createClient } from "../supabase/server";
import { LanguageModelCode } from "../ai/providers";

export async function getChatById({ id }: { id: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }

  return data;
}

export async function saveChat({
  id,
  title,
  visibility,
}: {
  id: string;
  title: string;
  visibility: ChatVisibility;
}) {
  const supabase = await createClient();

  try {
    return await supabase.from("chats").insert({
      id,
      title,
      visibility,
    });
  } catch {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function saveMessage({
  chatId,
  message,
}: {
  chatId: string;
  message: Message & { model_code: LanguageModelCode };
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("messages").insert({
    chat_id: chatId,
    role: message.role,
    parts: message.parts,
    attachments: message.experimental_attachments ?? [],
    created_at: new Date(),
    content: message.content,
    model_code: message.model_code,
  });

  if (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }

  return data;
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("messages")
      .select()
      .eq("chat_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to get messages by chat id"
      );
    }

    return data;
  } catch {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    );
  }
}
