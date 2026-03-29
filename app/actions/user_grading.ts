'use server'
import { UserSubmissionGrade, UserSubmissionGradeInsert } from '../types/user_submission_grade';
import { createClient } from '../utils/supabase/server'


export async function getUserGradingForSubmissionById({ userId, submissionId }: { userId: string, submissionId: string }) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('submission_grading')
        .select('*, event_grading_criteria (percentage)')
        .eq('submission_id', submissionId)
        .eq('user_id', userId)
        .order('event_criteria_id', { ascending: false })
    return { data, error }
}

export async function updateUserGrading({ grades }: { grades: Array<UserSubmissionGradeInsert> }) {
    const supabase = await createClient();
    console.log(grades)
    const { data, error } = await supabase.from('submission_grading').upsert(grades, { onConflict: 'user_id, submission_id, event_criteria_id' })
    if (error) {
        console.log(error)
        throw new Error('Fail to update the grades')
    }
    return { data, error }
}

