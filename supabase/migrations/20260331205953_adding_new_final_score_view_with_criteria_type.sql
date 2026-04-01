create or replace view "public"."submission_final_scores" as  WITH user_total_per_submission AS (
         SELECT sg.submission_id,
            sg.user_id,
            sum((sg.grade * (c.percentage / (100.0)::double precision))) AS user_total
           FROM (public.submission_grading sg
             JOIN public.event_grading_criteria c ON ((sg.event_criteria_id = c.id)))
          WHERE (c.type = 'normal'::public."CRITERIA_TYPE")
          GROUP BY sg.submission_id, sg.user_id
        )
 SELECT submission_id,
    avg(user_total) AS final_average_score,
    count(user_id) AS total_graders
   FROM user_total_per_submission
  GROUP BY submission_id;


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


