'use client'

/**
 * PURPOSE:
 * Updates the registration status of an event in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/events.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique identifier of the target event.
 * - registrationStatus (EVENT_STATUS, Required): Target registration status enum value to set.
 */

import { createClient } from '@/app/utils/supabase/client'
import { EVENT_STATUS } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and executes an update query on table 'events' setting column 'registration_status'
 * to registrationStatus for matching eventId. Returns response data or error object on failure.
 *
 * PARAMETERS:
 * - eventId (string): Target event ID.
 * - registrationStatus (EVENT_STATUS): New registration status enum.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing database update response or error message.
 */
export async function updateEventRegistrationStatus(eventId: string, registrationStatus: EVENT_STATUS) {
    const supabase = createClient()
    const { data, error } = await supabase.from('events').update({ registration_status: registrationStatus }).eq('id', eventId)
    if (error) {
        return { error: 'Fail to update event registration status' }
    }
    return { data, error }
}
