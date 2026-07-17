import { Database } from "./database.types";
import { UNIVERSITY, YEAR } from "./enum";
import { Event, EventInsert, EventWithAwards } from "./event";
import { EventAwardsInsert } from "./event_awards";
import { EventChallengeInsert } from "./event_challenges";
import { AdminGroupChallenge } from "./group_challenge";
import { AdminGroupMember } from "./group_member";
import { Profile, ProfileInsert } from "./profile";

export type Group = Database["public"]["Tables"]["groups"]["Row"]

export type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"]

export interface UnifiedGroupMember {
    member_id: string | null
    profiles: {
        full_name: string | null
        email: string | null
        degree: string | null
        programme: string | null
    } | null
}

export interface UnifiedGroupChallenge {
    id: string
    challenge_id: string | null
    event_challenges: {
        company_name: string | null
        title: string | null
    } | null
}

export interface UnifiedGroupEventAward {
    id: string
    award_title: string | null
    award_type: string | null
    award_priority: number | null
}

export interface UnifiedGroup {
    id: string
    group_name: string | null
    short_description: string | null
    poster_path: string | null
    created_at: string
    events: {
        title: string | null
        event_awards?: UnifiedGroupEventAward[]
    } | null
    group_members: UnifiedGroupMember[]
    challenges: UnifiedGroupChallenge[]
}

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

export interface ProjectFilter {
    events: Array<string>
}

export interface EditGroupInfo {
    groupName: string,
    short_description: string
}

export interface GroupWithChallenge {
    id: string;
    group_name: string | null | undefined;
    group_challenge: {
        id: string
        challenge_id: string | null;
        event_challenges: EventChallengeInsert | null;
    }[];
}


export type UserGroupsWithEvent = {
    id: string;
    group_name: string | null;
    short_description: string | null;
    poster_path: string | null;
    created_at: string;
    event_id: string | null;
    events: {
        title: string | null;
        event_awards: EventAwardsInsert[];
    } | null;
    group_members: {
        member_id: string | null;
        profiles: {
            full_name: string | null;
            email: string | null;
            degree: "Bachelor" | "Master" | "Ph.D" | null;
            programme: | "Information Processing Science"
            | "Electronics and Communications Engineering"
            | "Computer Science and Engineering"
            | "Biomedical Engineering"
            | null;
        } | null;
    }[];
    challenges: {
        id: string;
        challenge_id: string | null;
        event_challenges: {
            company_name: string | null;
            title: string | null;
        } | null;
    }[];
}


export interface AdminGroups extends GroupInsert {
    group_members: AdminGroupMember[],
    events: EventInsert | null,
    group_challenge: AdminGroupChallenge[]
}