import { Database } from "./database.types";
import { UNIVERSITY, YEAR } from "./enum";
import { Event, EventInsert } from "./event";
import { Profile } from "./profile";

export type Group = Database["public"]["Tables"]["groups"]["Row"]

export type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"]

export type GroupInfo = {
    created_at: string;
    event_id: string | null;
    group_name: string | null;
    id: string;
    poster_path: string | null;
    short_description: string | null;
    group_members: {
        id: string;
        profiles: {
            id: string;
            email: string | null;
        } | null;
    }[];
    events: {
        title: string | null;
        max_group_members: number | null;
    } | null;
} | null

export type EventGroups = {
    created_at: string;
    event_id: string | null;
    group_name: string | null;
    id: string;
    short_description: string | null;
    poster_path: string | null;
    group_members: {
        member_id: string | null;
        profiles: Profile | null;
    }[];
    group_challenge: {
        challenge_id: string | null;
        event_challenges: {
            company_name: string | null;
            title: string | null;
        } | null;
    }[];
}

export type UserGroupsWithEvent = {
    created_at: string;
    event_id: string | null;
    group_name: string | null;
    id: string;
    short_description: string | null;
    poster_path: string | null;
    group_members: {
        member_id: string | null;
    }[];
    group_challenge: {
        challenge_id: string | null;
        event_challenges: {
            company_name: string | null;
            title: string | null;
        } | null;
    }[];
    events: EventInsert | null;
    all_members: {
        member_id: string | null;
        profiles: Profile | null;
    }[];
}[] | null


export type GroupEvents = {
    created_at: string;
    group_id: string | null;
    id: string;
    member_id: string | null;
    groups: {
        created_at: string;
        event_id: string | null;
        group_name: string | null;
        id: string;
        poster_path: string | null;
        events: {
            content: string | null;
            created_at: string;
            end_date: string | null;
            id: string;
            location: string | null;
            max_group_members: number | null;
            organized_date: string | null;
            owner_id: string | null;
            poster_path: string | null;
            short_description: string | null;
            start_date: string | null;
            status: "ongoing" | "finished" | null;
            title: string | null;
        } | null;
    } | null;
}[] | null


export interface Filter {
    challenges: Array<string>
    programmes: Array<string>,
    degrees: Array<string>
}

export interface EditGroupInfo {
    groupName: string,
    short_description: string
}