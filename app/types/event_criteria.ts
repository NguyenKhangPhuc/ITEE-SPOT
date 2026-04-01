import { Database } from "./database.types";

export type EventCriteria = Database["public"]["Tables"]['event_grading_criteria']["Row"]

export type EventCriteriaInsert = Database["public"]["Tables"]['event_grading_criteria']["Insert"]