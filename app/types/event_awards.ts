import { Database } from "./database.types"

export type EventAwards = Database["public"]["Tables"]['event_awards']["Row"]

export type EventAwardsInsert = Database["public"]["Tables"]["event_awards"]["Insert"]
