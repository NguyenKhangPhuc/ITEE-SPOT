drop policy "Public profiles are viewable by everyone." on "public"."profiles";


  create table "public"."event_grading_criteria" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "event_id" uuid,
    "criteria_name" text,
    "criteria_description" text,
    "percentage" real
      );


alter table "public"."event_grading_criteria" enable row level security;


  create table "public"."submission_grading" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid,
    "submission_id" uuid,
    "event_criteria_id" uuid,
    "grade" real
      );


alter table "public"."submission_grading" enable row level security;

CREATE UNIQUE INDEX event_grading_criteria_pkey ON public.event_grading_criteria USING btree (id);

CREATE UNIQUE INDEX submission_grading_pkey ON public.submission_grading USING btree (id);

alter table "public"."event_grading_criteria" add constraint "event_grading_criteria_pkey" PRIMARY KEY using index "event_grading_criteria_pkey";

alter table "public"."submission_grading" add constraint "submission_grading_pkey" PRIMARY KEY using index "submission_grading_pkey";

alter table "public"."event_grading_criteria" add constraint "event_grading_criteria_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."event_grading_criteria" validate constraint "event_grading_criteria_event_id_fkey";

alter table "public"."submission_grading" add constraint "submission_grading_event_criteria_id_fkey" FOREIGN KEY (event_criteria_id) REFERENCES public.event_grading_criteria(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_grading" validate constraint "submission_grading_event_criteria_id_fkey";

alter table "public"."submission_grading" add constraint "submission_grading_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_grading" validate constraint "submission_grading_submission_id_fkey";

alter table "public"."submission_grading" add constraint "submission_grading_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_grading" validate constraint "submission_grading_user_id_fkey";

create or replace view "public"."submission_final_scores" as  WITH user_total_per_submission AS (
         SELECT sg.submission_id,
            sg.user_id,
            sum((sg.grade * (c.percentage / (100.0)::double precision))) AS user_total
           FROM (public.submission_grading sg
             JOIN public.event_grading_criteria c ON ((sg.event_criteria_id = c.id)))
          GROUP BY sg.submission_id, sg.user_id
        )
 SELECT submission_id,
    avg(user_total) AS final_average_score,
    count(user_id) AS total_graders
   FROM user_total_per_submission
  GROUP BY submission_id;


grant delete on table "public"."event_grading_criteria" to "anon";

grant insert on table "public"."event_grading_criteria" to "anon";

grant references on table "public"."event_grading_criteria" to "anon";

grant select on table "public"."event_grading_criteria" to "anon";

grant trigger on table "public"."event_grading_criteria" to "anon";

grant truncate on table "public"."event_grading_criteria" to "anon";

grant update on table "public"."event_grading_criteria" to "anon";

grant delete on table "public"."event_grading_criteria" to "authenticated";

grant insert on table "public"."event_grading_criteria" to "authenticated";

grant references on table "public"."event_grading_criteria" to "authenticated";

grant select on table "public"."event_grading_criteria" to "authenticated";

grant trigger on table "public"."event_grading_criteria" to "authenticated";

grant truncate on table "public"."event_grading_criteria" to "authenticated";

grant update on table "public"."event_grading_criteria" to "authenticated";

grant delete on table "public"."event_grading_criteria" to "postgres";

grant insert on table "public"."event_grading_criteria" to "postgres";

grant references on table "public"."event_grading_criteria" to "postgres";

grant select on table "public"."event_grading_criteria" to "postgres";

grant trigger on table "public"."event_grading_criteria" to "postgres";

grant truncate on table "public"."event_grading_criteria" to "postgres";

grant update on table "public"."event_grading_criteria" to "postgres";

grant delete on table "public"."event_grading_criteria" to "service_role";

grant insert on table "public"."event_grading_criteria" to "service_role";

grant references on table "public"."event_grading_criteria" to "service_role";

grant select on table "public"."event_grading_criteria" to "service_role";

grant trigger on table "public"."event_grading_criteria" to "service_role";

grant truncate on table "public"."event_grading_criteria" to "service_role";

grant update on table "public"."event_grading_criteria" to "service_role";

grant delete on table "public"."submission_grading" to "anon";

grant insert on table "public"."submission_grading" to "anon";

grant references on table "public"."submission_grading" to "anon";

grant select on table "public"."submission_grading" to "anon";

grant trigger on table "public"."submission_grading" to "anon";

grant truncate on table "public"."submission_grading" to "anon";

grant update on table "public"."submission_grading" to "anon";

grant delete on table "public"."submission_grading" to "authenticated";

grant insert on table "public"."submission_grading" to "authenticated";

grant references on table "public"."submission_grading" to "authenticated";

grant select on table "public"."submission_grading" to "authenticated";

grant trigger on table "public"."submission_grading" to "authenticated";

grant truncate on table "public"."submission_grading" to "authenticated";

grant update on table "public"."submission_grading" to "authenticated";

grant delete on table "public"."submission_grading" to "postgres";

grant insert on table "public"."submission_grading" to "postgres";

grant references on table "public"."submission_grading" to "postgres";

grant select on table "public"."submission_grading" to "postgres";

grant trigger on table "public"."submission_grading" to "postgres";

grant truncate on table "public"."submission_grading" to "postgres";

grant update on table "public"."submission_grading" to "postgres";

grant delete on table "public"."submission_grading" to "service_role";

grant insert on table "public"."submission_grading" to "service_role";

grant references on table "public"."submission_grading" to "service_role";

grant select on table "public"."submission_grading" to "service_role";

grant trigger on table "public"."submission_grading" to "service_role";

grant truncate on table "public"."submission_grading" to "service_role";

grant update on table "public"."submission_grading" to "service_role";


  create policy "Enable delete for users based on user_id"
  on "public"."event_grading_criteria"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."event_grading_criteria"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."event_grading_criteria"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."event_grading_criteria"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable delete for users based on user_id"
  on "public"."submission_grading"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."submission_grading"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."submission_grading"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."submission_grading"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (((auth.uid() = id) OR (role <> ALL (ARRAY['admin'::public."PROFILE_ROLE", 'judge'::public."PROFILE_ROLE"]))));



