'use server'

/**
 * PURPOSE:
 * Allows the currently authenticated student user to remove themselves from a specified group.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/group_member.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): The target group ID string from which the user wants to leave.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Obtains the current authenticated user's ID from Supabase auth. If unauthenticated, returns error.
 * Otherwise, deletes the row in 'group_members' matching both the user's ID and the target groupId.
 *
 * PARAMETERS:
 * - groupId (string): Target group ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing deletion result or error payload.
 */
export async function removeStudentsThemselveFromGroupById(groupId: string) {
    const supabase = await createClient()

    const { data: student } = await supabase.auth.getUser()
    if (student.user == null) {
        return { error: 'You are not signed in' }
    }
    const { data, error } = await supabase.from('group_members').delete().eq('member_id', student.user.id).eq('group_id', groupId);
    if (error) {
        return { error: 'Fail to remove yourself from the group' }
    }
    return { data, error }
}
