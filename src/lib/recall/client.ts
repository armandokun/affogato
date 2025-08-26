/**
 * Recall.ai API client for meeting bot management
 */

export interface RecallBot {
  id: string
  meeting_url: string
  status_changes: Array<{
    code: string
    message: string
    created_at: string
  }>
  video_url?: string
  recording_started_at?: string
  recording_ended_at?: string
  status: 'joining' | 'in_meeting' | 'recording' | 'done' | 'error'
}

export interface CreateBotRequest {
  meeting_url: string
  bot_name?: string
  recording_mode?: 'speaker_view' | 'gallery_view'
  recording_mode_options?: {
    participant_video_when_screenshare?: boolean
  }
  transcription_options?: {
    provider?: 'deepgram' | 'assembly_ai' | 'rev' | 'aws_transcribe'
  }
  google_meet?: {
    google_login_group_id?: string
    login_required?: boolean
  }
}

export interface CreateBotResponse {
  id: string
  meeting_url: string
  status: string
}

export class RecallApiClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.RECALL_API_KEY!
    this.baseUrl = process.env.RECALL_API_BASE_URL || 'https://api.recall.ai'

    if (!this.apiKey) {
      throw new Error('RECALL_API_KEY environment variable is required')
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Token ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Recall API error ${response.status}: ${errorText}`)
    }

    return response.json()
  }

  /**
   * Create a bot to join a meeting
   */
  async createBot(request: CreateBotRequest): Promise<CreateBotResponse> {
    // Minimal bot request to avoid parameter issues
    const botRequest = {
      meeting_url: request.meeting_url,
      bot_name: request.bot_name || 'Affogato Bot'
      // Remove all optional parameters for now to test basic functionality
    }

    return this.makeRequest<CreateBotResponse>('/api/v1/bot', 'POST', botRequest)
  }

  /**
   * Get bot status and details
   */
  async getBot(botId: string): Promise<RecallBot> {
    return this.makeRequest<RecallBot>(`/api/v1/bot/${botId}`)
  }

  /**
   * List all bots
   */
  async listBots(): Promise<{ results: RecallBot[] }> {
    return this.makeRequest<{ results: RecallBot[] }>('/api/v1/bot')
  }

  /**
   * Delete a bot (stops recording and removes bot from meeting)
   */
  async deleteBot(botId: string): Promise<void> {
    await this.makeRequest(`/api/v1/bot/${botId}`, 'DELETE')
  }
}

export const recallClient = new RecallApiClient()
