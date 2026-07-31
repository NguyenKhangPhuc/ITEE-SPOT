'use server'

/**
 * PURPOSE:
 * Fetches all groups registered under a specific event ID along with member profiles and challenge details.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/groups.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - eventId (string, Required): Unique event ID string used to filter groups.
 */

import { createClient } from '@/app/utils/supabase/server'
import { UnifiedGroup } from '@/app/types/group'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'groups' filtering by 'event_id', joining 'events',
 * 'group_members' (with profiles), and 'group_challenge' (with event_challenges).
 *
 * PARAMETERS:
 * - eventId (string): Target event ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data: UnifiedGroup[] | null, error: { message: string } | null }>: Object containing UnifiedGroup array or error object.
 */
export async function getEventGroups(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('groups')
        .select(`
            id,
            group_name,
            short_description,
            poster_path,
            created_at,
            events (title),
            group_members (member_id, profiles (full_name, email, degree, programme)),
            challenges:group_challenge (id, challenge_id, event_challenges (company_name, title))
        `)
        .eq('event_id', eventId)
        .returns<UnifiedGroup[]>()

    if (error || !data) {
        return { data: null, error: error ? { message: error.message } : null }
    }

    return { data, error: null }
}
