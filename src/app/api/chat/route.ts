import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { NextResponse } from "next/server";
import getServerSession from "@/lib/auth";
import { LanguageModel, myProvider } from "@/lib/ai/providers";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const user = await getServerSession();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const {
      messages,
    }: {
      messages: Array<Message & { data?: { model?: string } }>;
    } = await request.json();

    const lastUserMessageWithModel = [...messages]
      .reverse()
      .find((m) => m.role === "user" && m.data && m.data.model);

    const selectedChatModel =
      lastUserMessageWithModel?.data?.model ||
      LanguageModel.OPENAI_CHAT_MODEL_FAST;

    return createDataStreamResponse({
      execute: (dataStream) => {
        console.log(
          "Calling streamText with model:",
          myProvider.languageModel(selectedChatModel).modelId
        );

        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: "You are a helpful assistant.",
          messages,
          maxSteps: 5,
          experimental_transform: smoothStream({ chunking: "word" }),
        });

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return "Oops, an error occured!";
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
