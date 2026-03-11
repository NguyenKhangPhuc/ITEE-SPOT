'use server'
import { createClient } from "../utils/supabase/server";

export async function getGroupChallenges({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('group_challenge')
        .select('*, groups (*), event_challenges (*)')
        .eq('group_id', groupId)

    return { data, error }
}
