'use client'

/**
 * PURPOSE:
 * Fetches a single project record associated with a specific group ID and group challenge relation ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/projects.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing group_id and group_challenge_id.
 *   - group_id (string, Required): Target group ID string.
 *   - group_challenge_id (string, Required): Target group_challenge relation ID string.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'projects' matching both 'group_id' and 'group_challenge_id',
 * selecting awards, files, and event award details.
 *
 * PARAMETERS:
 * - { group_id, group_challenge_id }: Object holding target group and group challenge identifiers.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing project record or error message string.
 */
export async function getSingleProjectByGroupAndChallenge({ group_id, group_challenge_id }: { group_id: string, group_challenge_id: string }) {
    const supabase = createClient()
    const { data, error } = await supabase.from('projects')
        .select('*, project_awards(*), project_files(*), groups (event_id, events (id, event_awards(*)))')
        .eq('group_id', group_id)
        .eq('group_challenge_id', group_challenge_id)
        .maybeSingle()
    if (error) {
        return { error: "Failed to fetch the information" }
    }

    return { data, error }
}
