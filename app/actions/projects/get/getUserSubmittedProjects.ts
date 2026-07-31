'use server'

/**
 * PURPOSE:
 * Fetches all project submissions submitted by groups in which a specified user is a member.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/projects.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing userId, status filter, and ascending sort direction.
 *   - userId (string, Required): The user ID string to query submissions for.
 *   - status (PROJECT_STATUS | null, Required): Optional project status enum filter.
 *   - ascending (boolean, Required): Sorting order flag for creation date.
 */

import { createClient } from '@/app/utils/supabase/server'
import { PROJECT_STATUS } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Queries view 'projects_with_priority' joining project_awards and groups (with group_members filtering by member_id),
 * ordered by creation date. Applies status filter if status parameter is supplied.
 *
 * PARAMETERS:
 * - { userId, status, ascending }: Parameters for target user, status filter, and sort direction.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing user submitted projects array or error message string.
 */
export async function getUserSubmittedProjects({ userId, status, ascending }: { userId: string, status: PROJECT_STATUS | null, ascending: boolean }) {
    const supabase = await createClient()
    let query = supabase
        .from('projects_with_priority')
        .select(`*,
            project_awards!inner (
                *, 
                event_awards!inner (*)
            ), 
            groups!inner (
                group_name, 
                short_description, 
                event_id, 
                poster_path,
                events (*),
                group_members!inner (member_id, profiles (*))
            )
        `)
        .eq('groups.group_members.member_id', userId)
        .order('created_at', { ascending: ascending })
    if (status) {
        query = query.eq('project_status', status);
    }

    const { data, error } = await query;
    if (error) {
        return { error: 'Fail to fetch all projects' }
    }
    return { data, error }
}
