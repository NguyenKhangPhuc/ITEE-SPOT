drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop view if exists "public"."submission_final_scores";

create or replace view "public"."submission_criteria_user_grades" as  SELECT sg.submission_id,
    c.id AS criteria_id,
    c.criteria_name,
    c.percentage,
    sg.user_id,
    p.full_name AS user_name,
    sg.grade,
    (sg.grade * (c.percentage / (100.0)::double precision)) AS weighted_score
   FROM ((public.submission_grading sg
     JOIN public.event_grading_criteria c ON ((sg.event_criteria_id = c.id)))
     JOIN public.profiles p ON ((p.id = sg.user_id)))
  WHERE (c.type = 'normal'::public."CRITERIA_TYPE");


create or replace view "public"."submission_normal_criteria_cells" as  SELECT submission_id,
    criteria_id,
    criteria_name,
    avg(weighted_score) AS avg_score,
    jsonb_agg(jsonb_build_object('user_id', user_id, 'user_name', user_name, 'grade', grade, 'weighted_score', weighted_score) ORDER BY user_id) AS graders
   FROM public.submission_criteria_user_grades
  GROUP BY submission_id, criteria_id, criteria_name;


create or replace view "public"."submission_ratings_cell" as  SELECT sr.submission_id,
    avg(sr.rating) AS avg_rating,
    count(sr.user_id) AS total_raters,
    jsonb_agg(jsonb_build_object('user_id', sr.user_id, 'user_name', p.full_name, 'rating', sr.rating) ORDER BY sr.user_id) AS raters
   FROM (public.submission_ratings sr
     JOIN public.profiles p ON ((p.id = sr.user_id)))
  GROUP BY sr.submission_id;


create or replace view "public"."submission_specific_criteria_user_grades" as  SELECT sg.submission_id,
    c.id AS criteria_id,
    c.criteria_name,
    c.percentage,
    sg.user_id,
    p.full_name AS user_name,
    sg.grade,
    (sg.grade * (c.percentage / (100.0)::double precision)) AS weighted_score
   FROM ((public.submission_grading sg
     JOIN public.event_grading_criteria c ON ((sg.event_criteria_id = c.id)))
     JOIN public.profiles p ON ((p.id = sg.user_id)))
  WHERE (c.type <> 'normal'::public."CRITERIA_TYPE");


create or replace view "public"."submission_user_final_points" as  SELECT submission_id,
    user_id,
    user_name,
    sum(weighted_score) AS user_total
   FROM public.submission_criteria_user_grades
  GROUP BY submission_id, user_id, user_name;


create or replace view "public"."submission_final_cell" as  SELECT submission_id,
    avg(user_total) AS final_avg_score
   FROM public.submission_user_final_points
  GROUP BY submission_id;


create or replace view "public"."submission_specific_criteria_cells" as  SELECT submission_id,
    criteria_id,
    criteria_name,
    avg(weighted_score) AS avg_score,
    jsonb_agg(jsonb_build_object('user_id', user_id, 'user_name', user_name, 'grade', grade, 'weighted_score', weighted_score) ORDER BY user_id) AS graders
   FROM public.submission_specific_criteria_user_grades
  GROUP BY submission_id, criteria_id, criteria_name;


create or replace view "public"."submission_final_scores" as  SELECT s.id AS submission_id,
    g.id AS group_id,
    g.group_name,
    g.event_id,
    fc.final_avg_score,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('criteria_id', nc.criteria_id, 'criteria_name', nc.criteria_name, 'avg_score', nc.avg_score, 'graders', nc.graders) ORDER BY nc.criteria_id) AS jsonb_agg
           FROM public.submission_normal_criteria_cells nc
          WHERE (nc.submission_id = s.id)), '[]'::jsonb) AS normal_criteria,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('criteria_id', sc.criteria_id, 'criteria_name', sc.criteria_name, 'avg_score', sc.avg_score, 'graders', sc.graders) ORDER BY sc.criteria_id) AS jsonb_agg
           FROM public.submission_specific_criteria_cells sc
          WHERE (sc.submission_id = s.id)), '[]'::jsonb) AS specific_criteria,
    rc.avg_rating,
    rc.total_raters,
    COALESCE(rc.raters, '[]'::jsonb) AS raters,
    s.title AS submission_title
   FROM (((public.submissions s
     JOIN public.groups g ON ((g.id = s.group_id)))
     LEFT JOIN public.submission_final_cell fc ON ((fc.submission_id = s.id)))
     LEFT JOIN public.submission_ratings_cell rc ON ((rc.submission_id = s.id)));



  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to public
using (((role = 'student'::public."PROFILE_ROLE") OR (( SELECT auth.uid() AS uid) = id)));



