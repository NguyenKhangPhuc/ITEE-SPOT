import { Database } from "./database.types";
import { Event, EventInsert } from "./event";

export type SubmissionFile = Database["public"]["Tables"]["submission_files"]["Row"]

export type SubmissionFileInsert = Database["public"]["Tables"]["submission_files"]["Insert"]


export interface SubmissionFileExtended extends SubmissionFileInsert {
    file?: File;
}