alter table "public"."projects" drop constraint "projects_id_fkey";

alter table "public"."project_awards" alter column "id" set default gen_random_uuid();

alter table "public"."project_awards" alter column "id" drop identity;

alter table "public"."project_awards" alter column "id" set data type uuid using "id"::uuid;

CREATE UNIQUE INDEX unique_project_group ON public.projects USING btree (group_id, group_challenge_id);

alter table "public"."projects" add constraint "unique_project_group" UNIQUE using index "unique_project_group";

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

grant delete on table "public"."project_awards" to "postgres";

grant insert on table "public"."project_awards" to "postgres";

grant references on table "public"."project_awards" to "postgres";

grant select on table "public"."project_awards" to "postgres";

grant trigger on table "public"."project_awards" to "postgres";

grant truncate on table "public"."project_awards" to "postgres";

grant update on table "public"."project_awards" to "postgres";

grant delete on table "public"."project_files" to "postgres";

grant insert on table "public"."project_files" to "postgres";

grant references on table "public"."project_files" to "postgres";

grant select on table "public"."project_files" to "postgres";

grant trigger on table "public"."project_files" to "postgres";

grant truncate on table "public"."project_files" to "postgres";

grant update on table "public"."project_files" to "postgres";

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


