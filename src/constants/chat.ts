import { LanguageModelCode } from "@/lib/ai/providers";
import { UIMessage } from "ai";

export enum ChatVisibility {
  PERMANENT = "permanent",
  TEMPORARY = "temporary",
}

export type DbMessage = {
  id: string;
  role: UIMessage["role"];
  parts: UIMessage["parts"];
  experimental_attachments: UIMessage["experimental_attachments"];
  content: string;
  created_at: Date;
  model_code: LanguageModelCode;
};
