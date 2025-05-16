import {
  UIMessage,
  appendClientMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth";
import { LanguageModelCode, myProvider } from "@/lib/ai/providers";
import { systemPrompt } from "@/lib/ai/prompts";
import {
  getChatById,
  getMessagesByChatId,
  saveChat,
  saveMessage,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { generateTitleFromUserMessage } from "@/app/dashboard/actions";
import { ChatVisibility } from "@/constants/chat";
import { getTrailingMessageId } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    message,
    selectedVisibilityType,
    selectedChatModelCode,
  }: {
    id: string;
    message: UIMessage;
    selectedChatModelCode: LanguageModelCode;
    selectedVisibilityType: ChatVisibility;
  } = await request.json();

  try {
    const user = await getServerSession();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const chatId = id;

    const chat = await getChatById({ id: chatId });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id: chatId,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.user_id !== user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    const previousMessages = await getMessagesByChatId({ id: chatId });

    const messages = appendClientMessage({
      messages: previousMessages,
      message,
    });

    const lastSelectedModelCode =
      selectedChatModelCode || LanguageModelCode.OPENAI_CHAT_MODEL_FAST;

    await saveMessage({
      chatId,
      message: {
        id: message.id,
        role: message.role,
        parts: message.parts,
        experimental_attachments: message.experimental_attachments ?? [],
        createdAt: new Date(),
        content: message.content,
        model_code: lastSelectedModelCode,
      },
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeMessageAnnotation({
          model_code: lastSelectedModelCode,
        });

        const result = streamText({
          model: myProvider.languageModel(lastSelectedModelCode),
          system: systemPrompt({ selectedChatModel: lastSelectedModelCode }),
          messages,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: "word" }),
          onFinish: async ({ response }) => {
            console.log(response.messages[response.messages.length - 1]);

            if (user.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === "assistant"
                  ),
                });

                if (!assistantId) {
                  throw new Error("No assistant message found!");
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [message],
                  responseMessages: response.messages,
                });

                await saveMessage({
                  chatId,
                  message: {
                    id: assistantId,
                    role: assistantMessage.role,
                    parts: assistantMessage.parts,
                    experimental_attachments:
                      assistantMessage.experimental_attachments ?? [],
                    createdAt: new Date(),
                    content: assistantMessage.content,
                    model_code: lastSelectedModelCode,
                  },
                });
              } catch (error) {
                console.error("Failed to save chat", error);
              }
            }
          },
        });

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
