'use server'
import { SubmissionInsert } from "../types/submission";
import { createClient } from "../utils/supabase/server";

export async function getUserGroups() {
    const supabase = await createClient();

    const { data: user, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
        return { data: null, error: { message: 'Fail to verify user' } }
    }

    const { data, error } = await supabase.from('group_members').select('*, groups (*, events (*))').eq('member_id', user.user.id);

    return { data, error }
}

export async function getSingleGroup({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('groups')
        .select('*, group_members (id, profiles (id, email)), events (title, max_group_members)').eq('id', groupId).single();

    return { data, error }
}

export async function updateGroupName({ groupId, groupName }: { groupId: string, groupName: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('groups').update({ group_name: groupName }).eq('id', groupId).select().maybeSingle();
    if (error) {
        throw new Error(error.message)
    }
    return data
}

export async function getEventGroups(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('groups')
        .select('*, group_members(member_id, profiles (email,full_name,id)), group_challenge(challenge_id, event_challenges (company_name, title))')
        .eq('event_id', eventId)

    return { data, error }
}