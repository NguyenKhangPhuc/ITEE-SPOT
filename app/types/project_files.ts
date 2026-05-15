import { Database } from "./database.types";
import { Event, EventInsert } from "./event";

export type ProjectFiles = Database["public"]["Tables"]["project_files"]["Row"]

export type ProjectFilesInsert = Database["public"]["Tables"]['project_files']["Insert"]


export interface ProjectFileExtended extends ProjectFilesInsert {
    file?: File;
}