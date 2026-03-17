import { Database } from "./database.types";

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
}