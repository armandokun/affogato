# Step 1: Meeting Recording Trigger (Detailed Breakdown)

## Goal

Enable users to mark meetings for recording and persist this information in the database.

## Steps

1. **UI Update**

   - Add a toggle/button in the meetings page UI to allow users to select if a meeting should be recorded by the Affogato AI agent.
   - Show the current recording status for each meeting (e.g., "Will be recorded" or "Not recorded").

2. **Backend API**

   - Create or update an API endpoint to handle updating the "recording" status for a meeting.
   - Accept meeting ID and recording flag (true/false) as input.

3. **Database Schema**

   - Add a `recording_requested` (boolean) field to the meetings table/model if it does not exist.
   - Ensure this field is accessible in both read and write operations.

4. **Persist & Reflect in UI**

   - When a user toggles the recording option, send the update to the backend and persist it in the database.
   - Update the UI to reflect the new status immediately (optimistic update or after confirmation from backend).

5. **Trigger Downstream Logic**
   - Ensure that when `recording_requested` is set to true, downstream processes (e.g., bot scheduling) are notified or can poll for meetings to record.

---

Next steps: Implement the UI, API, and database changes as described above.
