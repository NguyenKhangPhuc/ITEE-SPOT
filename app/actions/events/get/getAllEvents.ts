'use server'

/**
 * PURPOSE:
 * Fetches all event records stored in the events table from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/events.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and executes a select query querying all columns from the 'events' table.
 * Returns the query result object containing event records array or error payload.
 *
 * PARAMETERS:
 * None.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing event records array or error payload.
 */
export async function getAllEvents() {
    const supabase = await createClient();

    const { data, error } = await supabase.from("events").select("*");

    return { data, error }
}
