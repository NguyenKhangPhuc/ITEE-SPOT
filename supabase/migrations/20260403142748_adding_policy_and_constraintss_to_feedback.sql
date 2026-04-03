drop policy "Enable insert for authenticated users only" on "public"."submission_feedbacks";

drop policy "Policy with table joins" on "public"."submission_feedbacks";

drop policy "Enable insert for authenticated users only" on "public"."submission_ratings";

drop policy "Enable read access for all users" on "public"."submission_ratings";

drop policy "Policy with table joins" on "public"."submission_ratings";

CREATE UNIQUE INDEX unique_submission_user ON public.submission_feedbacks USING btree (submission_id, user_id);

alter table "public"."submission_feedbacks" add constraint "unique_submission_user" UNIQUE using index "unique_submission_user";

grant delete on table "public"."submission_feedbacks" to "postgres";

grant insert on table "public"."submission_feedbacks" to "postgres";

grant references on table "public"."submission_feedbacks" to "postgres";

grant select on table "public"."submission_feedbacks" to "postgres";

grant trigger on table "public"."submission_feedbacks" to "postgres";

grant truncate on table "public"."submission_feedbacks" to "postgres";

grant update on table "public"."submission_feedbacks" to "postgres";


  create policy "Enable insert for authenticated users only"
  on "public"."submission_feedbacks"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE"))))));



  create policy "Policy with table joins"
  on "public"."submission_feedbacks"
  as permissive
  for update
  to public
using (((( SELECT auth.uid() AS uid) = user_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE")))))));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_ratings"
  as permissive
  for insert
  to authenticated
with check (((( SELECT auth.uid() AS uid) = user_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE")))))));



  create policy "Enable read access for all users"
  on "public"."submission_ratings"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE")))))));



  create policy "Policy with table joins"
  on "public"."submission_ratings"
  as permissive
  for update
  to authenticated
using (((( SELECT auth.uid() AS uid) = user_id) AND (( SELECT auth.uid() AS uid) = user_id) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE")))))));



