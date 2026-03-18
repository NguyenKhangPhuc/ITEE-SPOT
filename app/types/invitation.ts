import { Database } from "./database.types"
import { Event } from "./event";

export type Invitation = Database["public"]["Tables"]["invitation"]["Row"]

export type InvitationInsert = Database["public"]["Tables"]["invitation"]["Insert"]

export type InvitationWithGroupsEvent = {
    created_at: string;
    group_id: string | null;
    id: string;
    invitation_status: "pending" | "rejected" | "accepted" | null;
    member_email: string | null;
    groups: {
        group_name: string | null;
        short_description: string | null;
        event_id: string | null;
        events: Event | null;
    } | null;
}

export interface ArrayInvitationWithGroupsEvent {
    invitations: Array<InvitationWithGroupsEvent | null>
}