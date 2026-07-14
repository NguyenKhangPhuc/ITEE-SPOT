export interface RegisterGroupMember {
    title: string;
    member_emails: string[]
    challenges: Array<string>;
    event_id: string;
    user_id: string;
    short_description: string;
}