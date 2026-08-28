'use client'

/**
 * PURPOSE:
 * Creates a new event record with ONGOING status owned by the currently authenticated user.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/events.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing event insert payload.
 *   - event (EventInsert, Required): Object containing title, description, content, location, dates, max_group_members.
 */

import { createClient } from '@/app/utils/supabase/client'
import { Event, EventInsert } from '@/app/types/event'
import { EVENT_STATUS } from '@/app/types/enum'
import { PostgrestError } from '@supabase/supabase-js'

/**
 * BEHAVIORAL MECHANISM:
 * Gets the current authenticated user ID, then inserts a new row into the 'events' table setting its status
 * to ONGOING and owner_id to the user ID. Returns the created event or error message on failure.
 *
 * PARAMETERS:
 * - { event }: Parameter object containing event (EventInsert).
 *
 * RETURN VALUE:
 * - Promise<{ data: Event | null, error: string | null }>: Object containing created event payload or error string.
 */
export async function createEvent({ event }: { event: EventInsert }) {
    const supabase = createClient();

    const { data: user } = await supabase.auth.getUser()

    const { data, error }: { data: Event | null, error: PostgrestError | null } = await supabase.from("events").insert(
        {
            title: event.title,
            short_description: event.short_description,
            content: event.content,
            location: event.location,
            max_group_members: event.max_group_members,
            start_date: event.start_date,
            end_date: event.end_date,
            organized_date: event.organized_date,
            status: EVENT_STATUS.ONGOING,
            owner_id: user.user?.id
        },
    ).select().single()

    if (error) {
        return { error: "Fail to create the event, please contact staffs" }
    }

    return { data, error: null }
}
