import { Database } from "./database.types";

export type ProjectAwards = Database["public"]["Tables"]['project_awards']["Row"]

export type ProjectAwardsInsert = Database["public"]["Tables"]['project_awards']["Insert"]