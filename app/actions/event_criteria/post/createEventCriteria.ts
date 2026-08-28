'use client'

/**
 * PURPOSE:
 * Inserts a new event grading criteria entry associated with an event into the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/event_criteria.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing newCriteria payload and target eventId.
 *   - newCriteria (EventCriteriaInsert, Required): The criteria details object to insert.
 *   - eventId (string, Required): The event ID string to associate with the new criteria.
 */

import { createClient } from '@/app/utils/supabase/client'
import { EventCriteriaInsert } from '@/app/types/event_criteria'

/**
 * BEHAVIORAL MECHANISM:
 * Validates that eventId is non-empty, assigns event_id onto newCriteria and clears any preset id,
 * then inserts the record into 'event_grading_criteria'. Returns created criteria or an error message.
 *
 * PARAMETERS:
 * - { newCriteria, eventId }: Parameter object with newCriteria (EventCriteriaInsert) and eventId (string).
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing created criteria or error message.
 */
export async function createEventCriteria({ newCriteria, eventId }: { newCriteria: EventCriteriaInsert, eventId: string }) {
    const supabase = createClient();
    newCriteria.event_id = eventId
    newCriteria.id = undefined
    if (eventId.length == 0 || !eventId) {
        return { error: "Fail to create the criteria 2" }
    }
    const { data, error } = await supabase.from('event_grading_criteria').insert(newCriteria).select("*").maybeSingle()
    if (error) {
        return { error: "Fail to create the criteria" }
    }

    return { data, error }
}
