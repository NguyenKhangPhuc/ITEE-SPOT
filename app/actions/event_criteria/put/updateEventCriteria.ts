'use server'

/**
 * PURPOSE:
 * Updates an existing event grading criteria record in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/event_criteria.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing updatedCriteria payload.
 *   - updatedCriteria (EventCriteriaInsert, Required): Object containing updated fields and criteria ID.
 */

import { createClient } from '@/app/utils/supabase/server'
import { EventCriteriaInsert } from '@/app/types/event_criteria'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and updates the 'event_grading_criteria' table matching the updatedCriteria's ID.
 * Returns the update result or an error message if the operation fails.
 *
 * PARAMETERS:
 * - { updatedCriteria }: Parameter object containing updatedCriteria (EventCriteriaInsert).
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing update payload or error message.
 */
export async function updateEventCriteria({ updatedCriteria }: { updatedCriteria: EventCriteriaInsert }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('event_grading_criteria').update(updatedCriteria).eq('id', updatedCriteria.id ?? "")

    if (error) {
        return { error: "Fail to update the criteria" }
    }

    return { data, error }
}
