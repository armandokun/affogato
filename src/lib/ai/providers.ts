import { customProvider } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export enum LanguageModel {
  OPENAI_CHAT_MODEL_FAST = "openai-chat-model-fast",
  OPENAI_CHAT_MODEL_LARGE = "openai-chat-model-large",
  ANTHROPIC_CHAT_MODEL_FAST = "anthropic-chat-model-fast",
  ANTHROPIC_CHAT_MODEL_LATEST = "anthropic-chat-model-latest",
  OPENAI_TITLE_MODEL = "openai-title-model",
}

export const myProvider = customProvider({
  languageModels: {
    [LanguageModel.OPENAI_CHAT_MODEL_FAST]: openai("gpt-4o-mini"),
    [LanguageModel.OPENAI_CHAT_MODEL_LARGE]: openai("gpt-4o"),
    [LanguageModel.ANTHROPIC_CHAT_MODEL_FAST]: anthropic(
      "claude-3-5-haiku-latest"
    ),
    [LanguageModel.ANTHROPIC_CHAT_MODEL_LATEST]: anthropic(
      "claude-3-7-sonnet-20250219"
    ),
    [LanguageModel.OPENAI_TITLE_MODEL]: openai("gpt-4-turbo"),
  },
});

export const modelDropdownOptions = [
  {
    value: LanguageModel.OPENAI_CHAT_MODEL_FAST,
    label: "4o-mini",
    description: "Fast, cost-effective, and great for most tasks.",
    logo: "/llm-icons/chatgpt.png",
  },
  {
    value: LanguageModel.OPENAI_CHAT_MODEL_LARGE,
    label: "4o",
    description: "More accurate, better reasoning, slower.",
    logo: "/llm-icons/chatgpt.png",
  },
  {
    value: LanguageModel.ANTHROPIC_CHAT_MODEL_FAST,
    label: "3.5 Haiku",
    description: "Anthropic's fast model, good for general use.",
    logo: "/llm-icons/claude.png",
  },
  {
    value: LanguageModel.ANTHROPIC_CHAT_MODEL_LATEST,
    label: "3.7 Sonnet",
    description: "Anthropic's latest and most capable model.",
    logo: "/llm-icons/claude.png",
  },
];
