'use server'

/**
 * PURPOSE:
 * Fetches all project records filtered optionally by project status and sorted by award priority, top priority, and creation date.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/projects.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing status and ascending ordering flag.
 *   - status (PROJECT_STATUS | null, Required): Project status enum filter or null for all statuses.
 *   - ascending (boolean, Required): Sorting order flag for creation date.
 */

import { createClient } from '@/app/utils/supabase/server'
import { PROJECT_STATUS } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Queries view 'projects_with_priority' with project awards (and event awards) and groups (events, member profiles),
 * ordering by award_priority, top_priority, and created_at. Applies status filter if status parameter is provided.
 *
 * PARAMETERS:
 * - { status, ascending }: Parameters for status filter and date sort direction.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing projects list array or error message string.
 */
export async function getAllProjectsBasedOnStatus({ status, ascending }: { status: PROJECT_STATUS | null, ascending: boolean }) {
    const supabase = await createClient()
    let query = supabase
        .from('projects_with_priority')
        .select(`
            *,
            project_awards (
                *, 
                event_awards (*)
            ), 
            groups (
                group_name, 
                short_description, 
                poster_path,
                event_id, 
                events (*),
                group_members (member_id, profiles (*))
            )
        `)
        .order('event_awards(award_priority)', {
            referencedTable: 'project_awards',
            ascending: true
        })
        .order('top_priority', { ascending: true })
        .order('created_at', { ascending: ascending })
    if (status) {
        query = query.eq('project_status', status);
    }
    const { data, error } = await query;

    if (error) {
        return { error: "Fail to load the projects" }
    }

    return { data, error: null }
}
