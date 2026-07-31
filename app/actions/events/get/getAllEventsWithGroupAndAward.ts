'use server'

/**
 * PURPOSE:
 * Fetches all events along with their nested event awards and participating groups with challenge details.
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
 * Initializes a server-side Supabase client and queries the 'events' table joining 'event_awards' and 'groups'
 * (including group_challenge and event_challenges). Returns aggregated event data or an error object on failure.
 *
 * PARAMETERS:
 * None.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing events with group and award relations or error message.
 */
export async function getAllEventsWithGroupAndAward() {
    const supabase = await createClient()

    const { data, error } = await supabase.from('events').select('*, event_awards(*), groups (id,group_name, group_challenge (id,challenge_id, event_challenges(*)))')
    if (error) {
        return { error: 'Fail to fetch informations' }
    }
    return { data, error }
}
