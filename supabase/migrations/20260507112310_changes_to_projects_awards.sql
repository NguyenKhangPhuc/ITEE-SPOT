revoke delete on table "public"."project_awards" from "anon";

revoke insert on table "public"."project_awards" from "anon";

revoke references on table "public"."project_awards" from "anon";

revoke select on table "public"."project_awards" from "anon";

revoke trigger on table "public"."project_awards" from "anon";

revoke truncate on table "public"."project_awards" from "anon";

revoke update on table "public"."project_awards" from "anon";

revoke delete on table "public"."project_awards" from "authenticated";

revoke insert on table "public"."project_awards" from "authenticated";

revoke references on table "public"."project_awards" from "authenticated";

revoke select on table "public"."project_awards" from "authenticated";

revoke trigger on table "public"."project_awards" from "authenticated";

revoke truncate on table "public"."project_awards" from "authenticated";

revoke update on table "public"."project_awards" from "authenticated";

revoke delete on table "public"."project_awards" from "service_role";

revoke insert on table "public"."project_awards" from "service_role";

revoke references on table "public"."project_awards" from "service_role";

revoke select on table "public"."project_awards" from "service_role";

revoke trigger on table "public"."project_awards" from "service_role";

revoke truncate on table "public"."project_awards" from "service_role";

revoke update on table "public"."project_awards" from "service_role";

alter table "public"."project_awards" drop constraint "project_awards_award_id_fkey";

alter table "public"."project_awards" drop constraint "project_awards_project_id_fkey";

alter table "public"."projects" drop constraint "projects_id_fkey";

alter table "public"."project_awards" drop constraint "project_awards_pkey";

drop index if exists "public"."project_awards_pkey";

drop table "public"."project_awards";


  create table "public"."projects_awards" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "award_id" uuid,
    "project_id" uuid
      );


alter table "public"."projects_awards" enable row level security;

CREATE UNIQUE INDEX projects_awards_pkey ON public.projects_awards USING btree (id);

CREATE UNIQUE INDEX projects_group_challenge_unique ON public.projects USING btree (group_id, group_challenge_id);

alter table "public"."projects_awards" add constraint "projects_awards_pkey" PRIMARY KEY using index "projects_awards_pkey";

alter table "public"."projects" add constraint "projects_group_challenge_unique" UNIQUE using index "projects_group_challenge_unique";

alter table "public"."projects_awards" add constraint "projects_awards_award_id_fkey" FOREIGN KEY (award_id) REFERENCES public.event_awards(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."projects_awards" validate constraint "projects_awards_award_id_fkey";

alter table "public"."projects_awards" add constraint "projects_awards_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."projects_awards" validate constraint "projects_awards_project_id_fkey";

grant delete on table "public"."projects_awards" to "anon";

grant insert on table "public"."projects_awards" to "anon";

grant references on table "public"."projects_awards" to "anon";

grant select on table "public"."projects_awards" to "anon";

grant trigger on table "public"."projects_awards" to "anon";

grant truncate on table "public"."projects_awards" to "anon";

grant update on table "public"."projects_awards" to "anon";

grant delete on table "public"."projects_awards" to "authenticated";

grant insert on table "public"."projects_awards" to "authenticated";

grant references on table "public"."projects_awards" to "authenticated";

grant select on table "public"."projects_awards" to "authenticated";

grant trigger on table "public"."projects_awards" to "authenticated";

grant truncate on table "public"."projects_awards" to "authenticated";

grant update on table "public"."projects_awards" to "authenticated";

grant delete on table "public"."projects_awards" to "postgres";

grant insert on table "public"."projects_awards" to "postgres";

grant references on table "public"."projects_awards" to "postgres";

grant select on table "public"."projects_awards" to "postgres";

grant trigger on table "public"."projects_awards" to "postgres";

grant truncate on table "public"."projects_awards" to "postgres";

grant update on table "public"."projects_awards" to "postgres";

grant delete on table "public"."projects_awards" to "service_role";

grant insert on table "public"."projects_awards" to "service_role";

grant references on table "public"."projects_awards" to "service_role";

grant select on table "public"."projects_awards" to "service_role";

grant trigger on table "public"."projects_awards" to "service_role";

grant truncate on table "public"."projects_awards" to "service_role";

grant update on table "public"."projects_awards" to "service_role";


