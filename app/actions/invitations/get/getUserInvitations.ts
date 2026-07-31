'use server'

/**
 * PURPOSE:
 * Fetches all invitation records addressed to a specific user email, ordered by creation date descending.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/invitations.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - userEmail (string, Required): The email address of the user querying invitations.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'invitation' matching 'member_email' (lowercased and trimmed),
 * joining table 'groups' (including event details), ordered by 'created_at' descending.
 *
 * PARAMETERS:
 * - userEmail (string): User email address string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing user invitation records array or error payload.
 */
export async function getUserInvitations(userEmail: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('invitation').select('*, groups (short_description, group_name, event_id, events (*))')
        .eq('member_email', userEmail.toLowerCase().trim())
        .order('created_at', { ascending: false })

    return { data, error }
}
