'use server'

/**
 * PURPOSE:
 * Fetches all project records from the database, ordered by creation date descending, including joined groups, events, and member profiles.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/projects.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'projects' selecting groups (with events and group_members/profiles),
 * ordered by 'created_at' descending.
 *
 * PARAMETERS:
 * None.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing projects list array or error message string.
 */
export async function getAllProjects() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('projects')
        .select('*, groups (group_name, short_description,poster_path, event_id, events (*), group_members (member_id, profiles (*)))')
        .order('created_at', { ascending: false })

    if (error) {
        return { error: "Fail to load the projects" }
    }
    return { data, error: null }
}
