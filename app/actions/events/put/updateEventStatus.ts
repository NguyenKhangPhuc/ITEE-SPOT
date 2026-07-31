'use server'

/**
 * PURPOSE:
 * Updates the lifecycle status (e.g., UPCOMING, ONGOING, COMPLETED) of an event record.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/events.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique identifier of the target event.
 * - eventStatus (EVENT_STATUS, Required): Target status enum value to set.
 */

import { createClient } from '@/app/utils/supabase/server'
import { EVENT_STATUS } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and executes an update query on table 'events' setting column 'status'
 * to eventStatus for the matching eventId. Returns update payload or error object on failure.
 *
 * PARAMETERS:
 * - eventId (string): Target event ID.
 * - eventStatus (EVENT_STATUS): New event status enum.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing database update response or error message.
 */
export async function updateEventStatus(eventId: string, eventStatus: EVENT_STATUS) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('events').update({ status: eventStatus }).eq('id', eventId)
    if (error) {
        return { error: 'Fail to update event status' }
    }
    return { data, error }
}
