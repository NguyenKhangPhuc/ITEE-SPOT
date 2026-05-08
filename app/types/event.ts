import { Database } from "./database.types";
import { EventAwards, EventAwardsInsert } from "./event_awards";
import { EventChallengeInsert } from "./event_challenges";
import { EventCriteria } from "./event_criteria";

export type Event = Database["public"]["Tables"]["events"]["Row"]

export type EventInsert = Database["public"]["Tables"]["events"]["Insert"]

export interface EventWithChallenges extends Event {
    event_challenges: {
        company_name: string | null;
        created_at: string;
        event_id: string | null;
        id: string;
        title: string | null;
    }[];
    event_grading_criteria: Array<EventCriteria> | null
}

export interface EventWithAwards extends EventInsert {
    event_awards: Array<EventAwardsInsert> | null
}


export interface EventWithGroupsAndAward extends EventInsert {
    groups: {
        id: string;
        group_name: string | null;
        group_challenge: {
            id: string
            challenge_id: string | null;
            event_challenges: EventChallengeInsert | null;
        }[];
    }[];
    event_awards: Array<EventAwardsInsert> | null
}