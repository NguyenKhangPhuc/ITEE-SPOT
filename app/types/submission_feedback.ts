import { Database } from "./database.types"
import { Event } from "./event";

export type SubmissionFeedback = Database["public"]["Tables"]['submission_feedbacks']["Row"]

export type SubmissionFeedbackInsert = Database["public"]["Tables"]["submission_feedbacks"]["Insert"]