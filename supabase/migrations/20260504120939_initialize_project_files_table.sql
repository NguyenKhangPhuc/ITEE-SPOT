
  create table "public"."project_files" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid,
    "storage_path" text,
    "original_file_name" text,
    "mime_type" text,
    "size" bigint,
    "created_at" timestamp with time zone not null default now(),
    "group_id" uuid
      );


alter table "public"."project_files" enable row level security;

CREATE UNIQUE INDEX project_files_pkey ON public.project_files USING btree (id);

alter table "public"."project_files" add constraint "project_files_pkey" PRIMARY KEY using index "project_files_pkey";

alter table "public"."project_files" add constraint "project_files_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_files" validate constraint "project_files_group_id_fkey";

alter table "public"."project_files" add constraint "project_files_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_files" validate constraint "project_files_project_id_fkey";

grant delete on table "public"."event_awards" to "postgres";

grant insert on table "public"."event_awards" to "postgres";

grant references on table "public"."event_awards" to "postgres";

grant select on table "public"."event_awards" to "postgres";

grant trigger on table "public"."event_awards" to "postgres";

grant truncate on table "public"."event_awards" to "postgres";

grant update on table "public"."event_awards" to "postgres";

grant delete on table "public"."fun_facts" to "postgres";

grant insert on table "public"."fun_facts" to "postgres";

grant references on table "public"."fun_facts" to "postgres";

grant select on table "public"."fun_facts" to "postgres";

grant trigger on table "public"."fun_facts" to "postgres";

grant truncate on table "public"."fun_facts" to "postgres";

grant update on table "public"."fun_facts" to "postgres";

grant delete on table "public"."project_files" to "anon";

grant insert on table "public"."project_files" to "anon";

grant references on table "public"."project_files" to "anon";

grant select on table "public"."project_files" to "anon";

grant trigger on table "public"."project_files" to "anon";

grant truncate on table "public"."project_files" to "anon";

grant update on table "public"."project_files" to "anon";

grant delete on table "public"."project_files" to "authenticated";

grant insert on table "public"."project_files" to "authenticated";

grant references on table "public"."project_files" to "authenticated";

grant select on table "public"."project_files" to "authenticated";

grant trigger on table "public"."project_files" to "authenticated";

grant truncate on table "public"."project_files" to "authenticated";

grant update on table "public"."project_files" to "authenticated";

grant delete on table "public"."project_files" to "postgres";

grant insert on table "public"."project_files" to "postgres";

grant references on table "public"."project_files" to "postgres";

grant select on table "public"."project_files" to "postgres";

grant trigger on table "public"."project_files" to "postgres";

grant truncate on table "public"."project_files" to "postgres";

grant update on table "public"."project_files" to "postgres";

grant delete on table "public"."project_files" to "service_role";

grant insert on table "public"."project_files" to "service_role";

grant references on table "public"."project_files" to "service_role";

grant select on table "public"."project_files" to "service_role";

grant trigger on table "public"."project_files" to "service_role";

grant truncate on table "public"."project_files" to "service_role";

grant update on table "public"."project_files" to "service_role";

grant delete on table "public"."projects" to "postgres";

grant insert on table "public"."projects" to "postgres";

grant references on table "public"."projects" to "postgres";

grant select on table "public"."projects" to "postgres";

grant trigger on table "public"."projects" to "postgres";

grant truncate on table "public"."projects" to "postgres";

grant update on table "public"."projects" to "postgres";

grant delete on table "public"."submission_feedbacks" to "postgres";

grant insert on table "public"."submission_feedbacks" to "postgres";

grant references on table "public"."submission_feedbacks" to "postgres";

grant select on table "public"."submission_feedbacks" to "postgres";

grant trigger on table "public"."submission_feedbacks" to "postgres";

grant truncate on table "public"."submission_feedbacks" to "postgres";

grant update on table "public"."submission_feedbacks" to "postgres";


  create policy "Enable delete for users based on user_id"
  on "public"."project_files"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = project_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Enable insert for authenticated users only"
  on "public"."project_files"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = project_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Enable read access for all users"
  on "public"."project_files"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."project_files"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = project_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



