import { Database } from "./database.types";

export type GroupChallengeRelation = Database["public"]["Tables"]["group_challenge"]["Row"]

export type GroupChallengeRelationInsert = Database["public"]["Tables"]["group_challenge"]["Insert"]

export type GroupChallengeWithGroupAndChallenge = {
    challenge_id: string | null;
    created_at: string;
    event_id: string | null;
    group_id: string | null;
    id: string;
    groups: {
        created_at: string;
        event_id: string | null;
        group_name: string | null;
        id: string;
        short_description: string | null;
    } | null;
    event_challenges: {
        company_name: string | null;
        created_at: string;
        event_id: string | null;
        id: string;
        title: string | null;
    } | null;
}[] | null