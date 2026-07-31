'use server'

/**
 * PURPOSE:
 * Inserts a new event challenge option into the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/event_challenges.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - eventChallenge (EventChallengeInsert, Required): Object containing challenge title, company name, description, and event ID.
 */

import { createClient } from '@/app/utils/supabase/server'
import { EventChallengeInsert } from '@/app/types/event_challenges'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and executes an insert query on the 'event_challenges' table.
 * If database insertion encounters an error, it returns an error message object; otherwise returns inserted data.
 *
 * PARAMETERS:
 * - eventChallenge (EventChallengeInsert): Challenge insert payload.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing created challenge record or error message.
 */
export async function createEventChallenge(eventChallenge: EventChallengeInsert) {
    const supabase = await createClient()

    const { data, error } = await supabase.from('event_challenges').insert(eventChallenge).select('*').maybeSingle()

    if (error) {
        return { error: "Fail to create the challenge" }
    }

    return { data, error }
}
