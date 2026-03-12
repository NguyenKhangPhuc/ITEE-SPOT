'use server'
import { createClient } from "../utils/supabase/server";

export async function getSubmissionReactions({ submissionId }: { submissionId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('submission_reactions').select('*').eq('submission_id', submissionId)

    return { data, error }
}


export async function createReaction({ submissionId, userId }: { submissionId: string, userId: string }) {
    const supabase = await createClient();

    const { data: createdReaction, error: reactionError } = await supabase.from('submission_reactions').insert([{
        user_id: userId,
        submission_id: submissionId
    }]).select('*').maybeSingle()

    if (reactionError) {
        throw new Error(reactionError.message)
    }

    return createdReaction
}


export async function deleteReaction({ submissionId, userId }: { submissionId: string, userId: string }) {
    const supabase = await createClient()

    const { data, error } = await supabase.from('submission_reactions').delete().eq('submission_id', submissionId).eq('user_id', userId)

    if (error) {
        throw new Error(error.message)
    }

    return data
}