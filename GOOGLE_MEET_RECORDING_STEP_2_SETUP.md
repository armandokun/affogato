# Step 2 Setup Guide: Recall.ai Integration

## Overview

This guide covers the setup and configuration for the Recall.ai integration that enables automatic Google Meet recording.

## Files Created

### 1. Core API Client

- `src/lib/recall/client.ts` - Recall.ai API client with TypeScript interfaces

### 2. API Endpoints

- `src/app/api/meetings/bot/route.ts` - Start/stop bot manually for specific meetings
- `src/app/api/meetings/scheduler/route.ts` - Automated bot scheduling for upcoming meetings
- `src/app/api/webhooks/recall/route.ts` - Webhook handler for bot status updates

### 3. Database Migration

- `supabase/migrations/20250813172102_add_recall_bot_fields.sql` - Adds bot tracking fields

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Recall.ai Configuration
RECALL_API_KEY=your_recall_api_key_here
RECALL_API_BASE_URL=https://api.recall.ai
RECALL_WEBHOOK_SECRET=your_webhook_secret_here

# Cron Job Authentication (for scheduler)
CRON_SECRET=your_secure_random_token_here
```

## Setup Steps

### 1. Get Recall.ai API Key

1. Sign up at [Recall.ai](https://www.recall.ai/)
2. Go to your dashboard and create an API key
3. Add the key to your environment variables

### 2. Run Database Migration

```bash
npx supabase migration up
```

### 3. Configure Webhook (Optional but Recommended)

1. In Recall.ai dashboard, set webhook URL to: `https://your-domain.com/api/webhooks/recall`
2. This enables real-time status updates for bot activities

### 4. Set Up Cron Job (Optional)

For automatic bot scheduling, set up a cron job to call:

```bash
curl -X POST https://your-domain.com/api/meetings/scheduler \
  -H "Authorization: Bearer your_cron_secret_token"
```

Recommended schedule: Every 2-3 minutes

## API Usage

### Manual Bot Control

**Start Recording:**

```bash
POST /api/meetings/bot
{
  "calendarEventId": "event_123",
  "action": "start"
}
```

**Stop Recording:**

```bash
POST /api/meetings/bot
{
  "calendarEventId": "event_123",
  "action": "stop"
}
```

**Check Bot Status:**

```bash
GET /api/meetings/bot?calendarEventId=event_123
```

### Scheduled Bot Management

**Trigger Scheduler:**

```bash
POST /api/meetings/scheduler
Authorization: Bearer your_cron_secret
```

**Check Upcoming Meetings:**

```bash
GET /api/meetings/scheduler
Authorization: Bearer your_cron_secret
```

## Database Schema Changes

The migration adds these fields to the `meetings` table:

- `recall_bot_id` (TEXT) - Recall.ai bot ID
- `recording_status` (TEXT) - Bot status: none, joining, active, recording, stopped, error
- `bot_started_at` (TIMESTAMPTZ) - When bot was started
- `bot_ended_at` (TIMESTAMPTZ) - When bot finished/stopped
- `recording_url` (TEXT) - URL to recorded video
- `transcription_url` (TEXT) - URL to transcription

## Bot Lifecycle

1. **User enables recording** - Sets `recording_requested = true`
2. **Scheduler detects meeting** - 5 minutes before start time
3. **Bot joins meeting** - Status: `joining` → `active` → `recording`
4. **Recording completes** - Status: `done`, URLs saved
5. **Webhook updates status** - Real-time status synchronization

## Error Handling

The system handles:

- ✅ Bot join failures
- ✅ Network timeouts
- ✅ Recall.ai API errors
- ✅ Database update failures
- ✅ Meeting not found scenarios

## Testing

1. **Test bot creation:**

   ```bash
   curl -X POST localhost:3000/api/meetings/bot \
     -H "Content-Type: application/json" \
     -d '{"calendarEventId": "test_event", "action": "start"}'
   ```

2. **Test scheduler:**
   ```bash
   curl -X POST localhost:3000/api/meetings/scheduler \
     -H "Authorization: Bearer your_cron_secret"
   ```

## Next Steps

- Set up authenticated Google Meet bots (requires Google Workspace)
- Implement transcription processing and AI analysis
- Add user notifications for recording status
- Create UI components for bot management

## Troubleshooting

**Common Issues:**

- Missing API key: Check environment variables
- Bot join failures: Verify meeting URLs and permissions
- Webhook not working: Check URL and firewall settings
- Database errors: Ensure migration was applied

**Logs:**
Check server logs for detailed error messages from Recall.ai API calls.



