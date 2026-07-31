'use server'

/**
 * PURPOSE:
 * Fetches all event challenge options associated with a given event ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/event_challenges.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - id (string, Required): The unique event ID string used to query event challenges.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a server-side Supabase client and queries the 'event_challenges' table filtering by 'event_id'.
 * Returns the query result object containing fetched challenge records array or an error payload.
 *
 * PARAMETERS:
 * - id (string): The target event ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing challenge records array or error detail.
 */
export async function getEventChallenges(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("event_challenges").select("*").eq("event_id", id);

    return { data, error }
}
