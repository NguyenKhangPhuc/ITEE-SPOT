revoke delete on table "public"."projects_awards" from "anon";

revoke insert on table "public"."projects_awards" from "anon";

revoke references on table "public"."projects_awards" from "anon";

revoke select on table "public"."projects_awards" from "anon";

revoke trigger on table "public"."projects_awards" from "anon";

revoke truncate on table "public"."projects_awards" from "anon";

revoke update on table "public"."projects_awards" from "anon";

revoke delete on table "public"."projects_awards" from "authenticated";

revoke insert on table "public"."projects_awards" from "authenticated";

revoke references on table "public"."projects_awards" from "authenticated";

revoke select on table "public"."projects_awards" from "authenticated";

revoke trigger on table "public"."projects_awards" from "authenticated";

revoke truncate on table "public"."projects_awards" from "authenticated";

revoke update on table "public"."projects_awards" from "authenticated";

revoke delete on table "public"."projects_awards" from "service_role";

revoke insert on table "public"."projects_awards" from "service_role";

revoke references on table "public"."projects_awards" from "service_role";

revoke select on table "public"."projects_awards" from "service_role";

revoke trigger on table "public"."projects_awards" from "service_role";

revoke truncate on table "public"."projects_awards" from "service_role";

revoke update on table "public"."projects_awards" from "service_role";

alter table "public"."projects_awards" drop constraint "projects_awards_award_id_fkey";

alter table "public"."projects_awards" drop constraint "projects_awards_project_id_fkey";

drop view if exists "public"."projects_with_priority";

alter table "public"."projects_awards" drop constraint "projects_awards_pkey";

drop index if exists "public"."projects_awards_pkey";

drop table "public"."projects_awards";


  create table "public"."project_awards" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "award_id" uuid,
    "project_id" uuid
      );


alter table "public"."project_awards" enable row level security;

CREATE UNIQUE INDEX projects_awards_pkey ON public.project_awards USING btree (id);

alter table "public"."project_awards" add constraint "projects_awards_pkey" PRIMARY KEY using index "projects_awards_pkey";

alter table "public"."project_awards" add constraint "projects_awards_award_id_fkey" FOREIGN KEY (award_id) REFERENCES public.event_awards(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_awards" validate constraint "projects_awards_award_id_fkey";

alter table "public"."project_awards" add constraint "projects_awards_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_awards" validate constraint "projects_awards_project_id_fkey";

create or replace view "public"."projects_with_priority" as  SELECT id,
    created_at,
    group_id,
    project_status,
    github_link,
    project_title,
    short_description,
    description,
    youtube_link,
    group_challenge_id,
    ( SELECT min(ea.award_priority) AS min
           FROM (public.project_awards pa
             JOIN public.event_awards ea ON ((pa.award_id = ea.id)))
          WHERE (pa.project_id = p.id)) AS top_priority
   FROM public.projects p;


grant delete on table "public"."project_awards" to "anon";

grant insert on table "public"."project_awards" to "anon";

grant references on table "public"."project_awards" to "anon";

grant select on table "public"."project_awards" to "anon";

grant trigger on table "public"."project_awards" to "anon";

grant truncate on table "public"."project_awards" to "anon";

grant update on table "public"."project_awards" to "anon";

grant delete on table "public"."project_awards" to "authenticated";

grant insert on table "public"."project_awards" to "authenticated";

grant references on table "public"."project_awards" to "authenticated";

grant select on table "public"."project_awards" to "authenticated";

grant trigger on table "public"."project_awards" to "authenticated";

grant truncate on table "public"."project_awards" to "authenticated";

grant update on table "public"."project_awards" to "authenticated";

grant delete on table "public"."project_awards" to "postgres";

grant insert on table "public"."project_awards" to "postgres";

grant references on table "public"."project_awards" to "postgres";

grant select on table "public"."project_awards" to "postgres";

grant trigger on table "public"."project_awards" to "postgres";

grant truncate on table "public"."project_awards" to "postgres";

grant update on table "public"."project_awards" to "postgres";

grant delete on table "public"."project_awards" to "service_role";

grant insert on table "public"."project_awards" to "service_role";

grant references on table "public"."project_awards" to "service_role";

grant select on table "public"."project_awards" to "service_role";

grant trigger on table "public"."project_awards" to "service_role";

grant truncate on table "public"."project_awards" to "service_role";

grant update on table "public"."project_awards" to "service_role";


