'use server'

/**
 * PURPOSE:
 * Fetches all event grading criteria records for a specific event ID, ordered by ID descending.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/event_criteria.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): The unique identifier string of the target event.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries the 'event_grading_criteria' table filtering by 'event_id'
 * and ordering by 'id' descending. Returns the fetched criteria records or an error payload.
 *
 * PARAMETERS:
 * - eventId (string): The unique event ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing criteria records array or error payload.
 */
export async function getEventCriteriaById(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('event_grading_criteria').select('*').eq('event_id', eventId)
        .order('id', { ascending: false });
    return { data, error }
}
