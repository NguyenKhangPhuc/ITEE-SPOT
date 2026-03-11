revoke delete on table "public"."submission_files" from "anon";

revoke insert on table "public"."submission_files" from "anon";

revoke references on table "public"."submission_files" from "anon";

revoke select on table "public"."submission_files" from "anon";

revoke trigger on table "public"."submission_files" from "anon";

revoke truncate on table "public"."submission_files" from "anon";

revoke update on table "public"."submission_files" from "anon";

revoke delete on table "public"."submission_files" from "authenticated";

revoke insert on table "public"."submission_files" from "authenticated";

revoke references on table "public"."submission_files" from "authenticated";

revoke select on table "public"."submission_files" from "authenticated";

revoke trigger on table "public"."submission_files" from "authenticated";

revoke truncate on table "public"."submission_files" from "authenticated";

revoke update on table "public"."submission_files" from "authenticated";

revoke delete on table "public"."submission_files" from "service_role";

revoke insert on table "public"."submission_files" from "service_role";

revoke references on table "public"."submission_files" from "service_role";

revoke select on table "public"."submission_files" from "service_role";

revoke trigger on table "public"."submission_files" from "service_role";

revoke truncate on table "public"."submission_files" from "service_role";

revoke update on table "public"."submission_files" from "service_role";

alter table "public"."submission_files" drop constraint "submission_files_group_id_fkey";

alter table "public"."submission_files" drop constraint "submission_files_submission_id_fkey";

drop function if exists "public"."delete_storage_file"();

alter table "public"."submission_files" drop constraint "submission_files_pkey";

drop index if exists "public"."submission_files_pkey";

drop table "public"."submission_files";


