'use client'

/**
 * PURPOSE:
 * Updates general information fields of an existing event record in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/events.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing event payload.
 *   - event (EventInsert, Required): Object containing event ID and updated metadata fields.
 */

import { createClient } from '@/app/utils/supabase/client'
import { EventInsert } from '@/app/types/event'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and executes an update query on table 'events' for the given event ID,
 * updating fields like title, dates, descriptions, content, max_group_members, organized_date, and location.
 *
 * PARAMETERS:
 * - { event }: Parameter object containing event metadata.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing update payload or error message.
 */
export async function updateEventInfo({ event }: { event: EventInsert }) {
    const supabase = createClient()
    const { data, error } = await supabase.from('events').update({
        title: event.title,
        start_date: event.start_date,
        end_date: event.end_date,
        short_description: event.short_description,
        content: event.content,
        max_group_members: event.max_group_members,
        organized_date: event.organized_date,
        location: event.location
    }).eq('id', event.id!)

    if (error) {
        return { error: "Fail to update event information" }
    }
    return { data, error }
}
