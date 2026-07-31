'use server'

/**
 * PURPOSE:
 * Fetches all group records in which the currently authenticated user is a member.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/groups.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Retrieves the active user from Supabase Auth, fetches group IDs from 'group_members' for that user,
 * then queries table 'groups' for those IDs along with events, members, and challenge details.
 *
 * PARAMETERS:
 * None.
 *
 * RETURN VALUE:
 * - Promise<{ data: any[] | null, error: { message: string } | null }>: Object containing user's groups array or error object.
 */
export async function getUserGroups() {
    const supabase = await createClient();

    const { data: user, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
        return { data: null, error: { message: 'Fail to verify user' } }
    }
    const { data: myGroupIds, error: groupIdsError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('member_id', user.user.id);

    if (groupIdsError || !myGroupIds) {
        return { data: null, error: { message: groupIdsError?.message ?? 'Fail to fetch group ids' } };
    }

    const groupIds = myGroupIds.map(g => g.group_id ?? "");

    if (groupIds.length === 0) {
        return { data: [], error: null };
    }
    
    const { data, error } = await supabase
        .from('groups')
        .select(`
            id,
            group_name,
            short_description,
            poster_path,
            created_at,
            event_id,
            events (title, event_awards (*)),
            group_members (
                member_id, 
                profiles (full_name, email, degree, programme)
            ),
            challenges:group_challenge (
                id, 
                challenge_id, 
                event_challenges (company_name, title)
            )
        `)
        .in('id', groupIds);

    if (error || !data) {
        return { data: null, error: error ? { message: error.message } : null }
    }

    return { data, error: null }
}
