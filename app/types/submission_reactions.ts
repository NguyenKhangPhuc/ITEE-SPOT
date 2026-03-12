import { Database } from "./database.types";
import { Event, EventInsert } from "./event";

export type SubmissionReaction = Database["public"]["Tables"]["submission_reactions"]["Row"]

export type SubmissionReactionInsert = Database["public"]["Tables"]["submission_reactions"]["Insert"]
