'use server'
import { SubmissionRatingInsert } from "../types/submission_rating";
import { createClient } from "../utils/supabase/server";

export async function getSubmissionRatingById({ submissionId, userId }: { submissionId: string, userId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('submission_ratings').select('*')
        .eq('user_id', userId)
        .eq('submission_id', submissionId).maybeSingle()

    if (error) {
        throw new Error(error.message)
    }
    return data
}


export async function createSubmissionRating({ submissionRating }: { submissionRating: SubmissionRatingInsert }) {
    const supabase = await createClient()


    const { data, error } = await supabase.from('submission_ratings').upsert(submissionRating, { onConflict: 'user_id,submission_id' })

    if (error) {
        throw new Error(error.message)
    }

    return data
}