import { Database } from "./database.types";

export type FunFacts = Database["public"]["Tables"]["fun_facts"]["Row"]

export type FunFactsInsert = Database["public"]["Tables"]["fun_facts"]["Insert"]