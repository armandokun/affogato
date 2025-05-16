import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { UIMessage } from "ai";

import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { getServerSession } from "@/lib/auth";
import { LOGIN } from "@/constants/routes";
import { ChatVisibility, DbMessage } from "@/constants/chat";
import { LanguageModelCode } from "@/lib/ai/providers";

import ChatPage from "../ChatPage";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const chat = await getChatById({ id });

  if (!chat) notFound();

  const user = await getServerSession();

  if (!user) redirect(LOGIN);

  if (chat.visibility === ChatVisibility.TEMPORARY) {
    if (!user) return notFound();

    if (user.id !== chat.user_id) return notFound();
  }

  const initialMessages = await getMessagesByChatId({ id });

  const convertToUIMessages = (
    messages: Array<DbMessage>
  ): Array<UIMessage> => {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: message.content,
      createdAt: message.created_at,
      experimental_attachments: message.experimental_attachments,
      data: {
        model_code: message.model_code,
      },
    }));
  };

  const cookieStore = await cookies();
  const chatModelFromCookie =
    (cookieStore.get("chat-model")?.value as LanguageModelCode) ||
    LanguageModelCode.OPENAI_CHAT_MODEL_FAST;

  return (
    <>
      <ChatPage
        chatId={id}
        createdAt={chat.created_at}
        visibilityType={chat.visibility}
        initialModel={chatModelFromCookie}
        initialMessages={convertToUIMessages(initialMessages)}
      />
    </>
  );
}
