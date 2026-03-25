'use server'
import { createClient } from "../utils/supabase/server";

export async function getSubmissionReactions({ submissionId }: { submissionId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('submission_reactions').select('*').eq('submission_id', submissionId)

    return { data, error }
}


export async function createReaction({ submissionId, userId }: { submissionId: string, userId: string }) {
    const supabase = await createClient();

    const { data, error: reactionError } = await supabase.from('submission_reactions').insert([{
        user_id: userId,
        submission_id: submissionId
    }]).select('*').maybeSingle()

    if (reactionError) {
        return { error: "Fail to create the reaction" }
    }

    return { data, error: reactionError }
}


export async function deleteReaction({ submissionId, userId }: { submissionId: string, userId: string }) {
    const supabase = await createClient()

    const { data, error } = await supabase.from('submission_reactions').delete().eq('submission_id', submissionId).eq('user_id', userId)

    if (error) {
        return { error: "Fail to delete the reaction" }
    }

    return { data, error }
}