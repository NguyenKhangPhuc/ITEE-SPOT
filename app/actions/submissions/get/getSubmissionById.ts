'use server'

/**
 * PURPOSE:
 * Fetches a single submission record by its unique submission ID including group event ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submissions.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - submissionId (string, Required): Target submission ID string.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'submissions' matching 'id' = submissionId, joining groups (event_id).
 *
 * PARAMETERS:
 * - submissionId (string): Target submission ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing single submission payload or error detail.
 */
export async function getSubmissionById(submissionId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('submissions')
        .select('*, groups (event_id)').eq('id', submissionId).maybeSingle()
    return { data, error }
}
