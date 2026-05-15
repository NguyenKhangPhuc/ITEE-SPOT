create type "public"."AWARD_TYPE" as enum ('general', 'specific');

create type "public"."PROJECTS_STATUS" as enum ('pending', 'accepted', 'rejected');


  create table "public"."event_awards" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid default gen_random_uuid(),
    "award_type" public."AWARD_TYPE",
    "award_title" text,
    "award_priority" smallint
      );


alter table "public"."event_awards" enable row level security;


  create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "award_id" uuid,
    "group_id" uuid,
    "project_status" public."PROJECTS_STATUS",
    "github_link" text,
    "project_title" text,
    "short_description" text,
    "description" text,
    "youtube_link" text
      );


alter table "public"."projects" enable row level security;

CREATE UNIQUE INDEX event_awards_pkey ON public.event_awards USING btree (id);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

alter table "public"."event_awards" add constraint "event_awards_pkey" PRIMARY KEY using index "event_awards_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."event_awards" add constraint "event_awards_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_awards" validate constraint "event_awards_event_id_fkey";

alter table "public"."projects" add constraint "projects_award_id_fkey" FOREIGN KEY (award_id) REFERENCES public.event_awards(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_award_id_fkey";

alter table "public"."projects" add constraint "projects_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_group_id_fkey";

grant delete on table "public"."event_awards" to "anon";

grant insert on table "public"."event_awards" to "anon";

grant references on table "public"."event_awards" to "anon";

grant select on table "public"."event_awards" to "anon";

grant trigger on table "public"."event_awards" to "anon";

grant truncate on table "public"."event_awards" to "anon";

grant update on table "public"."event_awards" to "anon";

grant delete on table "public"."event_awards" to "authenticated";

grant insert on table "public"."event_awards" to "authenticated";

grant references on table "public"."event_awards" to "authenticated";

grant select on table "public"."event_awards" to "authenticated";

grant trigger on table "public"."event_awards" to "authenticated";

grant truncate on table "public"."event_awards" to "authenticated";

grant update on table "public"."event_awards" to "authenticated";

grant delete on table "public"."event_awards" to "postgres";

grant insert on table "public"."event_awards" to "postgres";

grant references on table "public"."event_awards" to "postgres";

grant select on table "public"."event_awards" to "postgres";

grant trigger on table "public"."event_awards" to "postgres";

grant truncate on table "public"."event_awards" to "postgres";

grant update on table "public"."event_awards" to "postgres";

grant delete on table "public"."event_awards" to "service_role";

grant insert on table "public"."event_awards" to "service_role";

grant references on table "public"."event_awards" to "service_role";

grant select on table "public"."event_awards" to "service_role";

grant trigger on table "public"."event_awards" to "service_role";

grant truncate on table "public"."event_awards" to "service_role";

grant update on table "public"."event_awards" to "service_role";

grant delete on table "public"."fun_facts" to "postgres";

grant insert on table "public"."fun_facts" to "postgres";

grant references on table "public"."fun_facts" to "postgres";

grant select on table "public"."fun_facts" to "postgres";

grant trigger on table "public"."fun_facts" to "postgres";

grant truncate on table "public"."fun_facts" to "postgres";

grant update on table "public"."fun_facts" to "postgres";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "postgres";

grant insert on table "public"."projects" to "postgres";

grant references on table "public"."projects" to "postgres";

grant select on table "public"."projects" to "postgres";

grant trigger on table "public"."projects" to "postgres";

grant truncate on table "public"."projects" to "postgres";

grant update on table "public"."projects" to "postgres";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."submission_feedbacks" to "postgres";

grant insert on table "public"."submission_feedbacks" to "postgres";

grant references on table "public"."submission_feedbacks" to "postgres";

grant select on table "public"."submission_feedbacks" to "postgres";

grant trigger on table "public"."submission_feedbacks" to "postgres";

grant truncate on table "public"."submission_feedbacks" to "postgres";

grant update on table "public"."submission_feedbacks" to "postgres";


  create policy "Enable delete for users based on user_id"
  on "public"."event_awards"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable insert for authenticated users only"
  on "public"."event_awards"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable read access for all users"
  on "public"."event_awards"
  as permissive
  for select
  to public
using (true);



  create policy "Policy with table joins"
  on "public"."event_awards"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable delete for users based on user_id"
  on "public"."projects"
  as permissive
  for delete
  to public
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = projects.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Enable insert for authenticated users only"
  on "public"."projects"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = projects.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Enable read access for all users"
  on "public"."projects"
  as permissive
  for select
  to public
using (true);



  create policy "Policy with table joins"
  on "public"."projects"
  as permissive
  for update
  to public
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = projects.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



