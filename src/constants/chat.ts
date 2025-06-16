import { LanguageModelCode } from '@/lib/ai/providers'
import { UIMessage } from 'ai'

export enum ChatVisibility {
  PERMANENT = 'permanent',
  TEMPORARY = 'temporary'
}

export type DbMessage = {
  id: string
  role: UIMessage['role']
  parts: UIMessage['parts']
  attachments: UIMessage['experimental_attachments']
  content: string
  created_at: Date
  model_code: LanguageModelCode
}

export const SELECTED_MODEL_COOKIE = 'affogato_selected_model'
