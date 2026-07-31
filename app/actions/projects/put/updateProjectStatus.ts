'use server'

/**
 * PURPOSE:
 * Updates the project_status column for a target project record in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/projects.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing projectId and new status.
 *   - projectId (string, Required): Target project ID string.
 *   - status (PROJECT_STATUS, Required): Target PROJECT_STATUS enum value to assign.
 */

import { createClient } from '@/app/utils/supabase/server'
import { PROJECT_STATUS } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and updates column 'project_status' in table 'projects' for matching projectId.
 *
 * PARAMETERS:
 * - { projectId, status }: Parameter object containing project ID and status enum.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing update result payload or error message string.
 */
export async function updateProjectStatus({ projectId, status }: { projectId: string, status: PROJECT_STATUS }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('projects').update({ project_status: status }).eq('id', projectId)
        .maybeSingle()
    if (error) {
        return { error: 'Failed to update the project status' }
    }
    return { data, error }
}
