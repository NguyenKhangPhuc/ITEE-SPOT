'use server'

/**
 * PURPOSE:
 * Fetches a single event record by ID including its associated challenges and grading criteria.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/events.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - id (string, Required): Unique event identifier string.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries the 'events' table filtering by ID, joining 'event_challenges'
 * and 'event_grading_criteria' relations. Returns the single event payload or error detail.
 *
 * PARAMETERS:
 * - id (string): Target event ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing the single event record or error payload.
 */
export async function getSingleEvent(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("events").select("*, event_challenges (*), event_grading_criteria (*)").eq("id", id).single();

    return { data, error }
}
