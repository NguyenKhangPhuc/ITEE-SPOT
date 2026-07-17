'use server'
import { SubmissionInsert } from "../types/submission";
import { createClient } from "../utils/supabase/server";
import { UnifiedGroup } from "../types/group";

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
        .in('id', groupIds); // Lọc theo group_id thay vì lọc theo members.member_id


    if (error || !data) {
        return { data: null, error: error ? { message: error.message } : null }
    }
    // console.log(data[0].group_members)

    return { data, error: null }
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
        .select(`
            id,
            group_name,
            short_description,
            poster_path,
            created_at,
            events (title),
            group_members (member_id, profiles (full_name, email, degree, programme)),
            challenges:group_challenge (id, challenge_id, event_challenges (company_name, title))
        `)
        .eq('event_id', eventId)
        .returns<UnifiedGroup[]>()

    if (error || !data) {
        return { data: null, error: error ? { message: error.message } : null }
    }

    return { data, error: null }
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

export async function getAllGroups() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('groups').select('*, events (*), group_members (*, profiles (*)), group_challenge (*, event_challenges (*))')
    if (error) {
        // console.log(error)
        return { error: 'Failed to get all groups' }
    }
    return { data, error }
}