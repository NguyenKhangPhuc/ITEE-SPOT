import { EventInsert } from "./event"

import { Database } from "./database.types"
import { EventAwardsInsert } from "./event_awards";
import { ProfileInsert } from "./profile";

export type Projects = Database["public"]["Tables"]["projects"]["Row"]

export type ProjectsInsert = Database["public"]["Tables"]["projects"]["Insert"]


export interface ProjectsSummary {
    id: string;
    group_id: string | null;
    project_awards: {
        award_id: string | null;
        created_at: string;
        id: number;
        project_id: string | null;
        event_awards: EventAwardsInsert | null;
    }[];
    groups: {
        group_name: string | null;
        event_id: string | null;
        events: EventInsert | null;
        short_description: string | null;
    } | null;
}

export interface SingleProject extends ProjectsInsert {
    project_awards: {
        award_id: string | null;
        created_at: string;
        id: number;
        project_id: string | null;
        event_awards: {
            award_priority: number | null;
            award_title: string | null;
            award_type: "general" | "specific" | "participant" | null;
            event_id: string | null;
            id: string;
        } | null;
    }[];
    groups: {
        group_name: string | null;
        group_members: {
            id: string;
            profiles: ProfileInsert | null;
        }[];
        events: EventInsert | null;
    } | null;
}