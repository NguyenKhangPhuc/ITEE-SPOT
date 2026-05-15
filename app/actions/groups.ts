'use server'
import { SubmissionInsert } from "../types/submission";
import { createClient } from "../utils/supabase/server";

export async function getUserGroups() {
    const supabase = await createClient();

    const { data: user, error: userError } = await supabase.auth.getUser()

    if (!user || userError) {
        return { data: null, error: { message: 'Fail to verify user' } }
    }

    const { data, error } = await supabase.from('groups')
        .select('*, group_members!inner (member_id), group_challenge(id, challenge_id, event_challenges (company_name, title)), events(*, event_awards(*)), all_members:group_members (member_id, profiles (*))')
        .eq('group_members.member_id', user.user.id)

    return { data, error }
}

export async function getSingleGroup({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('groups')
        .select('*, group_members (id, profiles (id, email)), events (title, max_group_members)').eq('id', groupId).single();

    return { data, error }
}

export async function updateGroupNameAndDescription({ groupId, groupName, description }: { groupId: string, groupName: string, description: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('groups').update({ group_name: groupName, short_description: description }).eq('id', groupId).select().maybeSingle();
    if (error) {
        return { error: "Fail to update the group information" }
    }
    return { data, error }
}

export async function getEventGroups(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('groups')
        .select('*, group_members(member_id, profiles (*)), group_challenge(challenge_id, event_challenges (company_name, title))')
        .eq('event_id', eventId)

    return { data, error }
}

export async function updateGroupPosterPath({ groupId, avatarFile, originalPath }: { groupId: string, avatarFile: File | null, originalPath: string | null }) {
    const supabase = await createClient();
    let avatarUrlPath = null
    if (avatarFile != null) {
        avatarUrlPath = `${groupId}/${Date.now()}-${avatarFile.name}`;

        const { error: storageError } = await supabase.storage.from('attachments').upload(avatarUrlPath, avatarFile);
        if (storageError) {
            return { error: "Failed to upload the group image" }
        }

        if (originalPath != null || originalPath != "") {
            const { error: storageError } = await supabase.storage.from('attachments').remove([originalPath!]);
        }

        const { data, error } = await supabase.from('groups').update({ poster_path: avatarUrlPath }).eq('id', groupId)
        if (error) {
            return { error: "Fail to update the group image" }
        }
        return { data, error }
    }

    if (originalPath != null || originalPath != "") {
        const { error: storageError } = await supabase.storage.from('attachments').remove([originalPath!]);
    }
    const { data, error } = await supabase.from('groups').update({ poster_path: null }).eq('id', groupId)
    if (error) {
        return { error: "Fail to delete the group image" }
    }
    return { data, error }
}