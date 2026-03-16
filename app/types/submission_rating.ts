import { Database } from "./database.types";

export type SubmissionRating = Database["public"]["Tables"]['submission_ratings']["Row"]

export type SubmissionRatingInsert = Database["public"]["Tables"]["submission_ratings"]["Insert"]
