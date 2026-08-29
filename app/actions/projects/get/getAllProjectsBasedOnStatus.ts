'use server'

/**
 * PURPOSE:
 * Fetches all project records filtered optionally by project status and sorted by award priority, top priority, and creation date.
 * Cached via Next.js unstable_cache to avoid heavy repeated DB joins on high-traffic routes (e.g., Home Page).
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/projects.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing status and ascending ordering flag.
 *   - status (PROJECT_STATUS | null, Required): Project status enum filter or null for all statuses.
 *   - ascending (boolean, Required): Sorting order flag for creation date.
 */

import { unstable_cache } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/app/types/database.types'
import { PROJECT_STATUS } from '@/app/types/enum'

/**
 * Creates an anonymous Supabase server client without reading cookies().
 * Safe to be executed inside unstable_cache scope.
 */
function createPublicSupabaseClient() {
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return []
                },
                setAll() { },
            },
        }
    )
}

const fetchProjectsFromDb = async (status: PROJECT_STATUS | null, ascending: boolean) => {
    const supabase = createPublicSupabaseClient()
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

const getCachedProjects = unstable_cache(
    async (status: PROJECT_STATUS | null, ascending: boolean) => {
        return fetchProjectsFromDb(status, ascending)
    },
    ['projects-status-cache-key'],
    {
        revalidate: 86400,
        tags: ['projects']
    }
)

export async function getAllProjectsBasedOnStatus({ status, ascending }: { status: PROJECT_STATUS | null, ascending: boolean }) {
    return getCachedProjects(status, ascending)
}
