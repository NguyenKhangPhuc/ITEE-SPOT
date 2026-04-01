create type "public"."CRITERIA_TYPE" as enum ('normal', 'specific');

drop policy "Enable delete for users based on user_id" on "public"."event_grading_criteria";

drop policy "Enable insert for authenticated users only" on "public"."event_grading_criteria";

drop policy "Policy with table joins" on "public"."event_grading_criteria";

drop policy "Enable delete for users based on user_id" on "public"."submission_grading";

drop policy "Enable insert for authenticated users only" on "public"."submission_grading";

drop policy "Policy with table joins" on "public"."submission_grading";

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


  create policy "Enable delete for users based on user_id"
  on "public"."event_grading_criteria"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable insert for authenticated users only"
  on "public"."event_grading_criteria"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Policy with table joins"
  on "public"."event_grading_criteria"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable delete for users based on user_id"
  on "public"."submission_grading"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE"))))));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_grading"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE"))))));



  create policy "Policy with table joins"
  on "public"."submission_grading"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE"))))));



