'use server'

/**
 * PURPOSE:
 * Updates an existing event award record in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/event_awards.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - award (EventAwardsInsert, Required): Award payload containing updated fields and target award ID.
 */

import { EventAwardsInsert } from "@/app/types/event_awards"
import { createClient } from "@/app/utils/supabase/server"

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and executes an update query on the 'event_awards' table
 * matching the award's unique 'id'. Returns the updated award record or an error message on failure.
 *
 * PARAMETERS:
 * - award (EventAwardsInsert): Updated award record object containing target 'id'.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error?: string }>: Object containing updated award record or error message.
 */
export async function updateEventAward(award: EventAwardsInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('event_awards').update(award).eq('id', award.id ?? "").select('*').maybeSingle()
    if (error) {
        return { error: 'Fail to update the award' }
    }
    return { data, error }
}
