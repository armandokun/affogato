import { type Message, createDataStreamResponse, streamText } from "ai";
import { NextResponse } from "next/server";
import getServerSession from "@/lib/auth";
import { myProvider } from "@/lib/ai/providers";

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
      lastUserMessageWithModel?.data?.model || "openai-chat-model-small";

    // Debug transform that logs every message
    function debugTransform() {
      return new TransformStream({
        transform(msg, controller) {
          console.log("Transform saw message:", msg);
          controller.enqueue(msg);
        },
      });
    }

    return createDataStreamResponse({
      execute: (dataStream) => {
        console.log("Calling streamText with model:", selectedChatModel);
        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: "You are a helpful assistant.",
          messages,
          maxSteps: 5,
          experimental_transform: [debugTransform],
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
