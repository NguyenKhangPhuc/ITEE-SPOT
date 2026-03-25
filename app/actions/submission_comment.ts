'use server'
import { PAGE_SIZE } from "../constants";
import { SubmissionInsert } from "../types/submission";
import { SubmissionCommentInsert } from "../types/submission_comments";
import { SubmissionFileExtended, SubmissionFileInsert } from "../types/submission_files";
import { createClient } from "../utils/supabase/server";

export async function getSubmissionComments({ submissionId, page }: { submissionId: string, page: number }) {

    const supabase = await createClient();

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error, count } = await supabase.from('submission_comments').select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
        .eq('submission_id', submissionId)

    if (error) {
        console.log(error)
        return { error: "Fail to load the comments" }
    }

    const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
    return { data, totalPages, error: null }
}


export async function createSubmissionComment(submissionComment: SubmissionCommentInsert) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('submission_comments').insert(submissionComment).select('*').maybeSingle()
    if (error) {
        return { error: "Failed to create the comment" }
    }

    return { data, error }

}