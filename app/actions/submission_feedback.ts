'use server'
import { SubmissionFeedbackInsert } from "../types/submission_feedback";
import { createClient } from "../utils/supabase/server";

export async function updateSubmissionFeedback({ submissionFeedback }: { submissionFeedback: SubmissionFeedbackInsert }) {

    const supabase = await createClient();

    const { data, error } = await supabase.from('submission_feedbacks').upsert(submissionFeedback, { onConflict: 'user_id, submission_id' })

    if (error) {
        return { error: "Cannot create or update the submission feedback" }
    }
    return { data, error }
}

export async function getSubmissionFeedBackByUserIdAndSubmissionId({ userId, submissionId }: { userId: string, submissionId: string }) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('submission_feedbacks').select('*').eq('user_id', userId).eq('submission_id', submissionId).maybeSingle()
    return { data, error }
}

export async function getSubmissionFeedBackBySubmissionId({ submissionId }: { submissionId: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('submission_feedbacks').select('*').eq('submission_id', submissionId)
    return { data, error }
}

