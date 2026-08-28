'use client'
import { SubmissionRatingInsert } from "../types/submission_rating";
import { createClient } from "../utils/supabase/client";

export async function getSubmissionRatingById({ submissionId, userId }: { submissionId: string, userId: string }) {
    const supabase = createClient();

    const { data, error } = await supabase.from('submission_ratings').select('*')
        .eq('user_id', userId)
        .eq('submission_id', submissionId).maybeSingle()

    if (error) {
        return { error: "Failed to get the user rating" }
    }
    return { data, error }
}


export async function createSubmissionRating({ submissionRating }: { submissionRating: SubmissionRatingInsert }) {
    const supabase = createClient()


    const { data, error } = await supabase.from('submission_ratings').upsert(submissionRating, { onConflict: 'user_id,submission_id' })

    if (error) {
        return { error: "Fail to create the submission ratings" }
    }

    return { data, error }
}