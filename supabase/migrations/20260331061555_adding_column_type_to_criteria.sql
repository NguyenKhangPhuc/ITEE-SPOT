alter table "public"."event_grading_criteria" add column "type" public."CRITERIA_TYPE" default 'normal'::public."CRITERIA_TYPE";

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


