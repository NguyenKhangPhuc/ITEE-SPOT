'use server'

/**
 * PURPOSE:
 * Fetches detailed information for a single project record by its unique ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/projects.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing projectId.
 *   - projectId (string, Required): Unique project identifier string.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'projects' filtering by 'id', joining 'project_files',
 * 'groups' (members/profiles, events), and 'project_awards' (event_awards ordered by award_priority).
 *
 * PARAMETERS:
 * - { projectId }: Object payload with target projectId.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing single project record or error message.
 */
export async function getSingleProject({ projectId }: { projectId: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*, project_files(*), groups (group_name, group_members(id, profiles(*)), events(*)), project_awards (*, event_awards (*))')
        .order('event_awards(award_priority)', {
            referencedTable: 'project_awards',
            ascending: true
        })
        .eq('id', projectId)
        .single();

    if (error) {
        return { error: 'Failed to fetch the project' }
    }

    return { data, error }
}
