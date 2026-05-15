'use server'
import { UserSubmissionGrade, UserSubmissionGradeInsert } from '../types/user_submission_grade';
import { createClient } from '../utils/supabase/server'


export async function getUserGradingForSubmissionById({ userId, submissionId }: { userId: string, submissionId: string }) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('submission_grading')
        .select('*, event_grading_criteria!inner (percentage, type)')
        .eq('submission_id', submissionId)
        .eq('user_id', userId)
        .order('event_criteria_id', { ascending: false })
    return { data, error }
}

export async function updateUserGrading({ grades, submissionId }: { grades: Array<UserSubmissionGradeInsert>, submissionId: string }) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('submission_grading')
        .upsert(grades, { onConflict: 'user_id, submission_id, event_criteria_id' }).select('*, event_grading_criteria (percentage, type)')
        .order('event_criteria_id', { ascending: false })
    if (error) {
        return { error: "Failed to update the grade" }
    }
    const { data: newFinalScore, error: finalScoreError } = await supabase.from('submission_final_scores').select('*').eq('submission_id', submissionId).single();
    if (finalScoreError) {
        return { error: 'Fail to fetch new final score, please reload' }
    }
    return { data, error, newFinalScore }
}

