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
    title: string | null
    group_challenge: {
        id: string;
        event_challenges: {
            company_name: string | null;
            title: string | null;
        } | null;
    } | null;
    submission_files: {
        created_at: string;
        group_id: string | null;
        id: string;
        mime_type: string | null;
        original_file_name: string | null;
        size: number | null;
        storage_path: string | null;
        submission_id: string | null;
    }[];
    submission_reactions: {
        created_at: string;
        id: string;
        submission_id: string | null;
        user_id: string | null;
    }[];
    submission_ratings: {
        created_at: string;
        id: string;
        rating: number | null;
        submission_id: string | null;
        user_id: string | null;
    }[];
    fun_facts: {
        created_at: string;
        fact: string | null;
        id: string;
        submission_id: string | null;
    }[];
}[] | null

export type SubmissionWithEventId = {
    created_at: string;
    description: string | null;
    github_link: string | null;
    group_challenge_id: string | null;
    group_id: string | null;
    id: string;
    short_description: string | null;
    title: string | null;
    youtube_link: string | null;
    groups: {
        event_id: string | null;
    } | null;
} | null


export type SubmissionFinalScoreRating = {
    final_average_score: number | null;
    submission_id: string | null;
    total_graders: number | null;
    submissions: {
        created_at: string;
        description: string | null;
        github_link: string | null;
        group_challenge_id: string | null;
        group_id: string | null;
        id: string;
        short_description: string | null;
        title: string | null;
        youtube_link: string | null;
        groups: {
            id: string;
            group_name: string | null;
            event_id: string | null;
        };
        submission_grading: {
            created_at: string;
            event_criteria_id: string | null;
            grade: number | null;
            id: string;
            submission_id: string | null;
            user_id: string | null;
            event_grading_criteria: {
                percentage: number | null
                type: 'specific' | 'normal' | null
            } | null
        }[];
        submission_ratings: {
            rating: number | null
            id: string
        }[];
    };
}[] | null
