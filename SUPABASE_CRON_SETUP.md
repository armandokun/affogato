# Supabase Cron Job Setup for Meeting Bot Scheduler

## ✅ What's Implemented

Your Supabase database now has:

1. **pg_cron extension** enabled for scheduling jobs
2. **pg_net extension** enabled for HTTP requests
3. **`schedule_meeting_bots()` function** that automatically finds and schedules bots
4. **Cron job** running every 2 minutes to check for upcoming meetings

## 🔧 How It Works

1. **Every 2 minutes**, Supabase runs the `schedule_meeting_bots()` function
2. **Function finds meetings** that:
   - Have `recording_requested = true`
   - Start in 3-7 minutes
   - Don't have a bot assigned yet
   - Have a valid meeting URL
3. **Makes HTTP requests** to your Next.js API to start bots
4. **Returns results** with scheduled meeting details

## ⚙️ Configuration

### Environment Variables Needed

Add to your `.env.local`:

```bash
# Supabase Cron Configuration
CRON_SECRET=supabase-cron
RECALL_API_KEY=your_recall_api_key_here
```

### Supabase Configuration (Optional)

You can customize the API URL and secret by setting these in Supabase:

```sql
-- Set your production API URL (defaults to localhost:3000)
ALTER DATABASE postgres SET app.api_base_url = 'https://your-domain.com';

-- Set custom cron secret (defaults to 'supabase-cron')
ALTER DATABASE postgres SET app.cron_secret = 'your-custom-secret';
```

## 🧪 Testing the Setup

### 1. Test the Function Manually

```sql
-- Run the scheduler function directly
SELECT schedule_meeting_bots();
```

### 2. Check Cron Job Status

```sql
-- View active cron jobs
SELECT * FROM cron.job;

-- View cron job run history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### 3. Test with Upcoming Meeting

1. Create a meeting in your calendar that starts in 5 minutes
2. Set `recording_requested = true` for that meeting
3. Wait for the cron job to run
4. Check if the bot was created

## 🔍 Monitoring & Debugging

### Check Cron Job Logs

```sql
-- View recent cron job executions
SELECT
  job_id,
  start_time,
  end_time,
  status,
  return_message,
  command
FROM cron.job_run_details
WHERE job_id = (SELECT jobid FROM cron.job WHERE jobname = 'schedule-meeting-bots')
ORDER BY start_time DESC
LIMIT 5;
```

### Check Function Results

```sql
-- The function returns JSON with scheduled meeting details
-- You can see this in the return_message column above
```

### Check Meeting Bot Status

```sql
-- View meetings with bot info
SELECT
  meeting_title,
  meeting_start_time,
  recording_requested,
  recall_bot_id,
  recording_status,
  bot_started_at
FROM meetings
WHERE recording_requested = true
ORDER BY meeting_start_time DESC;
```

## 🛠️ Management Commands

### Pause Cron Job

```sql
SELECT cron.unschedule('schedule-meeting-bots');
```

### Resume Cron Job

```sql
SELECT cron.schedule(
  'schedule-meeting-bots',
  '*/2 * * * *',
  'SELECT schedule_meeting_bots();'
);
```

### Change Schedule (e.g., every minute)

```sql
SELECT cron.unschedule('schedule-meeting-bots');
SELECT cron.schedule(
  'schedule-meeting-bots',
  '* * * * *',
  'SELECT schedule_meeting_bots();'
);
```

## 🚨 Troubleshooting

### Common Issues

1. **HTTP requests failing**: Check your API URL and CRON_SECRET
2. **No meetings found**: Verify meeting data and timing
3. **Permission errors**: Ensure function has SECURITY DEFINER

### Debug Function

```sql
-- Check what meetings would be scheduled
SELECT
  id,
  calendar_event_id,
  meeting_title,
  meeting_start_time,
  recording_requested,
  recall_bot_id
FROM meetings m
WHERE m.recording_requested = true
  AND m.recall_bot_id IS NULL
  AND m.meeting_url IS NOT NULL
  AND m.meeting_start_time >= NOW()
  AND m.meeting_start_time <= NOW() + INTERVAL '7 minutes'
  AND m.meeting_start_time >= NOW() + INTERVAL '3 minutes';
```

## ✨ Benefits of Supabase Cron

- ✅ **Native integration** - runs directly in your database
- ✅ **No external dependencies** - no need for external cron services
- ✅ **Reliable** - built on PostgreSQL's proven job scheduling
- ✅ **Scalable** - handles multiple concurrent meetings
- ✅ **Monitoring** - built-in logging and status tracking
- ✅ **Cost-effective** - no additional service fees

Your meeting bot scheduler is now fully automated and running in Supabase! 🎉



