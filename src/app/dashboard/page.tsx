import { cookies } from "next/headers";
import { LanguageModelCode } from "@/lib/ai/providers";

import ChatPage from "./ChatPage";

const COOKIE_NAME = "affogato_selected_model";

export default async function DashboardPage() {
  const cookieValue = (await cookies()).get(COOKIE_NAME)?.value;

  const selectedModel = Object.values(LanguageModelCode).includes(
    cookieValue as LanguageModelCode
  )
    ? (cookieValue as LanguageModelCode)
    : LanguageModelCode.OPENAI_CHAT_MODEL_FAST;

  return (
    <ChatPage
      initialModel={selectedModel || LanguageModelCode.OPENAI_CHAT_MODEL_FAST}
    />
  );
}
