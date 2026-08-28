'use client'

/**
 * PURPOSE:
 * Updates title and company_name for an existing event challenge in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/events.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing eventChallenge payload.
 *   - eventChallenge (EventChallengeInsert, Required): Object holding target challenge ID, title, and company_name.
 */

import { createClient } from '@/app/utils/supabase/client'
import { EventChallengeInsert } from '@/app/types/event_challenges'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and updates table 'event_challenges' matching eventChallenge.id.
 * Returns the updated record array or an error payload if the database operation fails.
 *
 * PARAMETERS:
 * - { eventChallenge }: Parameter object with eventChallenge payload.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing updated challenge record array or error message.
 */
export async function updateEventChallenges({ eventChallenge }: { eventChallenge: EventChallengeInsert }) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('event_challenges')
        .update({ title: eventChallenge.title, company_name: eventChallenge.company_name })
        .eq('id', eventChallenge.id!)
        .select()

    if (error) {
        return { error: 'Failed to update challenge information' };
    }
    return { data, error }
}
