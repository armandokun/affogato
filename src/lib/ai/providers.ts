import { customProvider } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export enum LanguageModelCode {
  OPENAI_CHAT_MODEL_FAST = "openai-chat-model-fast",
  OPENAI_CHAT_MODEL_LARGE = "openai-chat-model-large",
  ANTHROPIC_CHAT_MODEL_FAST = "anthropic-chat-model-fast",
  ANTHROPIC_CHAT_MODEL_LATEST = "anthropic-chat-model-latest",
  OPENAI_TITLE_MODEL = "openai-title-model",
  GEMINI_CHAT_MODEL_FAST = "gemini-chat-model-fast",
}

export const myProvider = customProvider({
  languageModels: {
    [LanguageModelCode.OPENAI_CHAT_MODEL_FAST]: openai("gpt-4o-mini"),
    [LanguageModelCode.OPENAI_CHAT_MODEL_LARGE]: openai("gpt-4o"),
    [LanguageModelCode.ANTHROPIC_CHAT_MODEL_FAST]: anthropic(
      "claude-3-5-haiku-latest"
    ),
    [LanguageModelCode.ANTHROPIC_CHAT_MODEL_LATEST]: anthropic(
      "claude-3-7-sonnet-20250219"
    ),
    [LanguageModelCode.OPENAI_TITLE_MODEL]: openai("gpt-4-turbo"),
    [LanguageModelCode.GEMINI_CHAT_MODEL_FAST]: google("gemini-2.0-flash"),
  },
});

export const modelDropdownOptions = [
  {
    value: LanguageModelCode.OPENAI_CHAT_MODEL_FAST,
    label: "4o-mini",
    description: "Fast, cost-effective, and great for most tasks.",
    logo: "/llm-icons/chatgpt.png",
  },
  {
    value: LanguageModelCode.OPENAI_CHAT_MODEL_LARGE,
    label: "4o",
    description: "More accurate, better reasoning, slower.",
    logo: "/llm-icons/chatgpt.png",
  },
  {
    value: LanguageModelCode.ANTHROPIC_CHAT_MODEL_FAST,
    label: "3.5 Haiku",
    description: "Anthropic's fast model, good for general use.",
    logo: "/llm-icons/claude.png",
  },
  {
    value: LanguageModelCode.ANTHROPIC_CHAT_MODEL_LATEST,
    label: "3.7 Sonnet",
    description: "Anthropic's latest and most capable model.",
    logo: "/llm-icons/claude.png",
  },
  {
    value: LanguageModelCode.GEMINI_CHAT_MODEL_FAST,
    label: "2.0 Flash",
    description: "Google's most reliable and efficient model.",
    logo: "/llm-icons/gemini.png",
  },
];
