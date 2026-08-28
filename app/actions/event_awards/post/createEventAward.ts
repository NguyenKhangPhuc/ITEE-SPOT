'use client'

/**
 * PURPOSE:
 * Inserts a new event award entry into the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/event_awards.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - award (EventAwardsInsert, Required): Object payload containing award title, type, priority, and event ID.
 */

import { EventAwardsInsert } from "@/app/types/event_awards"
import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * Clears any explicit 'id' property on the input award payload to allow auto-generation,
 * then executes an insert query into the 'event_awards' table in Supabase.
 * Returns the newly created record or an error payload if insertion fails.
 *
 * PARAMETERS:
 * - award (EventAwardsInsert): Award insert payload object.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error?: string }>: Object containing inserted award record or error message.
 */
export async function createEventAwarđ(award: EventAwardsInsert) {
    const supabase = createClient()
    award.id = undefined
    const { data, error } = await supabase.from('event_awards').insert(award).select('*').maybeSingle()
    if (error) {
        return { error: 'Fail to insert new award' }
    }
    return { data, error }
}
