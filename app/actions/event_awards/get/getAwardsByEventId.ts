'use server'

/**
 * PURPOSE:
 * Fetches all event awards associated with a specific event ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/event_awards.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): The unique identifier of the event whose awards are being queried.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries the 'event_awards' table filtering by 'event_id'.
 * If the database query returns an error, it returns a user-friendly error message object.
 *
 * PARAMETERS:
 * - eventId (string): The unique event ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error?: string }>: Object containing award records array or error message.
 */
export async function getAwardsByEventId(eventId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('event_awards').select('*').eq('event_id', eventId)
    if (error) {
        return { error: 'Failed to fetch the awards' }
    }
    return { data, error }
}
