'use server'

/**
 * PURPOSE:
 * Fetches paginated comment records for a specific submission ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submission_comment.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing submissionId and page number.
 *   - submissionId (string, Required): Target submission ID string.
 *   - page (number, Required): Current page number for pagination calculation.
 */

import { createClient } from '@/app/utils/supabase/server'
import { PAGE_SIZE } from '@/app/constants'

/**
 * BEHAVIORAL MECHANISM:
 * Calculates pagination range based on PAGE_SIZE, queries table 'submission_comments' filtering by 'submission_id',
 * ordered by 'created_at' descending, and returns comments data array along with totalPages count.
 *
 * PARAMETERS:
 * - { submissionId, page }: Parameter object with target submissionId and current page number.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, totalPages?: number, error?: string | any }>: Object containing comments array, total pages count, or error message.
 */
export async function getSubmissionComments({ submissionId, page }: { submissionId: string, page: number }) {
    const supabase = await createClient();

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error, count } = await supabase.from('submission_comments').select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
        .eq('submission_id', submissionId)

    if (error) {
        return { error: "Fail to load the comments" }
    }

    const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
    return { data, totalPages, error: null }
}
