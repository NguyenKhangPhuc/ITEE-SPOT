CREATE UNIQUE INDEX unique_user_submission_criteria ON public.submission_grading USING btree (user_id, submission_id, event_criteria_id);

alter table "public"."submission_grading" add constraint "unique_user_submission_criteria" UNIQUE using index "unique_user_submission_criteria";

grant delete on table "public"."event_grading_criteria" to "postgres";

grant insert on table "public"."event_grading_criteria" to "postgres";

grant references on table "public"."event_grading_criteria" to "postgres";

grant select on table "public"."event_grading_criteria" to "postgres";

grant trigger on table "public"."event_grading_criteria" to "postgres";

grant truncate on table "public"."event_grading_criteria" to "postgres";

grant update on table "public"."event_grading_criteria" to "postgres";

grant delete on table "public"."submission_grading" to "postgres";

grant insert on table "public"."submission_grading" to "postgres";

grant references on table "public"."submission_grading" to "postgres";

grant select on table "public"."submission_grading" to "postgres";

grant trigger on table "public"."submission_grading" to "postgres";

grant truncate on table "public"."submission_grading" to "postgres";

grant update on table "public"."submission_grading" to "postgres";


