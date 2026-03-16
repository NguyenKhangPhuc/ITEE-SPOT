import { Database } from "./database.types";

export type Submission = Database["public"]["Tables"]["submissions"]["Row"]

export type SubmissionInsert = Database["public"]["Tables"]["submissions"]["Insert"]

export type GroupSubmissions = {
    created_at: string;
    description: string | null;
    github_link: string | null;
    group_challenge_id: string | null;
    group_id: string | null;
    id: string;
    short_description: string | null;
    youtube_link: string | null;
    group_challenge: {
        id: string;
        event_challenges: {
            company_name: string | null;
            title: string | null;
        } | null;
    } | null;
}[] | null