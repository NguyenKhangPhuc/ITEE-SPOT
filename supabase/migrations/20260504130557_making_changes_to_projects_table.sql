alter table "public"."projects" drop constraint "projects_award_id_fkey";

alter table "public"."projects" add constraint "projects_id_fkey" FOREIGN KEY (id) REFERENCES public.group_challenge(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_id_fkey";

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


