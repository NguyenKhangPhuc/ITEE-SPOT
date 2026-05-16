import { EventInsert } from "./event"

import { Database } from "./database.types"
import { EventAwardsInsert } from "./event_awards";
import { ProfileInsert } from "./profile";
import { ProjectFiles, ProjectFilesInsert } from "./project_files";

export type Projects = Database["public"]["Tables"]["projects"]["Row"]

export type ProjectsInsert = Database["public"]["Tables"]["projects"]["Insert"]


export interface ProjectsSummary {
    id: string | null;
    group_id: string | null;
    group_challenge_id: string | null
    project_title: string | null;
    project_status: "pending" | "rejected" | "accepted" | null;
    groups: {
        group_name: string | null;
        short_description: string | null;
        event_id: string | null;
        events: EventInsert | null;
        group_members: {
            member_id: string | null,
            profiles: ProfileInsert | null
        }[];
    } | null;

}

export interface ProjectsSummaryExtended extends ProjectsSummary {
    top_priority: number | null;
    project_awards: {
        award_id: string | null;
        created_at: string;
        id: string;
        project_id: string | null;
        event_awards: {
            award_priority: number | null;
            award_title: string | null;
            award_type: "general" | "specific" | "participant" | null;
            event_id: string | null;
            id: string;
        } | null;
    }[];
}


export interface SingleProject extends ProjectsInsert {
    project_files: ProjectFilesInsert[]
    project_awards: {
        award_id: string | null;
        created_at: string;
        id: string | null;
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