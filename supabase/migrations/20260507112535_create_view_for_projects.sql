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
           FROM (public.projects_awards pa
             JOIN public.event_awards ea ON ((pa.award_id = ea.id)))
          WHERE (pa.project_id = p.id)) AS top_priority
   FROM public.projects p;


grant delete on table "public"."projects_awards" to "postgres";

grant insert on table "public"."projects_awards" to "postgres";

grant references on table "public"."projects_awards" to "postgres";

grant select on table "public"."projects_awards" to "postgres";

grant trigger on table "public"."projects_awards" to "postgres";

grant truncate on table "public"."projects_awards" to "postgres";

grant update on table "public"."projects_awards" to "postgres";


