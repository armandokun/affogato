import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

import getServerSession from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const user = await getServerSession();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const supabase = await createClient();
    const { data: apiKeys, error } = await supabase
      .from("user_api_keys")
      .select("gemini_api_key, claude_api_key, chatgpt_api_key")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch API keys" }),
        {
          status: 500,
        }
      );
    }

    // For now, just log the keys (do not expose in production!)
    // console.log(apiKeys);
    // TODO: Use the correct key for the selected model (OpenAI, Gemini, Claude)

    // Use the user's ChatGPT API key if available, otherwise fallback to env
    const openai = createOpenAI({
      apiKey: apiKeys?.chatgpt_api_key || process.env.OPENAI_API_KEY,
    });

    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o"),
      system: "You are a helpful assistant.",
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
