import { Database } from "./database.types";
import { ProfileInsert } from "./profile";

export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"]

export type GroupMemberInsert = Database["public"]["Tables"]["group_members"]["Insert"]
export interface RegisterGroupMember {
    title: string;
    member_emails: string[]
    challenges: Array<string>;
    event_id: string;
    user_id: string;
    short_description: string;
}


export interface AdminGroupMember extends GroupMemberInsert {
    profiles: ProfileInsert | null
}