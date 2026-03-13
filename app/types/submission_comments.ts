import { Database } from "./database.types";

export type SubmissionComment = Database["public"]["Tables"]["submission_comments"]["Row"]

export type SubmissionCommentInsert = Database["public"]["Tables"]["submission_comments"]["Insert"]

export interface SubmissionCommentPagination {
    submissionComments: Array<SubmissionComment>
    totalPages: number
}