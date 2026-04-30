import { EventInsert } from "./event"

import { Database } from "./database.types"
import { EventAwardsInsert } from "./event_awards";

export type Projects = Database["public"]["Tables"]["projects"]["Row"]

export type ProjectsInsert = Database["public"]["Tables"]["projects"]["Insert"]


export interface ProjectsSummary {
    id: string;
    group_id: string | null;
    award_id: string | null;
    event_awards: EventAwardsInsert | null;
    groups: {
        group_name: string | null;
        event_id: string | null;
        events: EventInsert | null;
        short_description: string | null;
    } | null;
}

