import { Database } from "./database.types";
import { EventChallengeInsert } from "./event_challenges";

export type GroupChallengeRelation = Database["public"]["Tables"]["group_challenge"]["Row"]

export type GroupChallengeRelationInsert = Database["public"]["Tables"]["group_challenge"]["Insert"]

export type GroupChallengeWithGroupAndChallenge = {
    challenge_id: string | null;
    created_at: string;
    event_id: string | null;
    group_id: string | null;
    id: string;
    event_challenges: {
        company_name: string | null;
        created_at: string;
        event_id: string | null;
        id: string;
        title: string | null;
    } | null;
}[] | null

export interface AdminGroupChallenge extends GroupChallengeRelationInsert{
    event_challenges: EventChallengeInsert | null
}