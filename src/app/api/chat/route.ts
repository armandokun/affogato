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
  getMessageCountByUserId,
  getMessagesByChatId,
  getPlanNameByUserId,
  saveChat,
  saveMessage,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { generateTitleFromUserMessage } from "@/app/dashboard/actions";
import { ChatVisibility } from "@/constants/chat";
import { getTrailingMessageId } from "@/lib/utils";
import { webSearch } from "@/lib/ai/tools";
import { entitlementsByPlanName, PlanName } from "@/constants/user";

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

    const planNamePromise = getPlanNameByUserId({ userId: user.id });
    const messageCountPromise = getMessageCountByUserId({
      id: user.id,
      differenceInHours: 24,
    });
    const chatPromise = getChatById({ id: chatId });
    const previousMessagesPromise = getMessagesByChatId({ id: chatId });

    const [
      planName,
      messageCount,
      chat,
      previousMessages,
    ] = await Promise.all([
      planNamePromise,
      messageCountPromise,
      chatPromise,
      previousMessagesPromise,
    ]);

    const formattedPlanName = planName?.toLowerCase() as PlanName;

    if (messageCount > entitlementsByPlanName[formattedPlanName].maxMessagesPerDay) {
      return new ChatSDKError("rate_limit:chat").toResponse();
    }

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      saveChat({
        id: chatId,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.user_id !== user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    const transformedPreviousMessages = previousMessages.map((message) => ({
      ...message,
      experimental_attachments: message.attachments || [],
    }));

    const messages = appendClientMessage({
      messages: transformedPreviousMessages,
      message,
    });

    const lastSelectedModelCode =
      selectedChatModelCode || LanguageModelCode.OPENAI_CHAT_MODEL_FAST;

    saveMessage({
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
          temperature: 0.5,
          topP: 0.9,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: "word" }),
          tools: {
            webSearch,
          },
          onFinish: async ({ response }) => {
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

                saveMessage({
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
                console.error("Failed to save message", error);
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
