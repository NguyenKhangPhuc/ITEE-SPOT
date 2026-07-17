'use server'
import { createClient } from "../utils/supabase/server";

export async function getGroupChallenges({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('group_challenge')
        .select('*, event_challenges (*)')
        .eq('group_id', groupId)

    return { data, error }
}


export async function deleteGroupChallengeById(groupChallengeId: string){
    const supabase = await createClient()
    const {data, error} = await supabase.from('group_challenge').delete().eq('id', groupChallengeId)
    if (error) {
        return {error: 'Failed to delete the group_challenge'}
    }
    return {data,error}
}