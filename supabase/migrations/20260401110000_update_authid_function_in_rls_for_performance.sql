drop policy "Enable delete for users based on user_id" on "public"."event_challenges";

drop policy "Enable insert for authenticated users only" on "public"."event_challenges";

drop policy "Policy with table joins" on "public"."event_challenges";

drop policy "Enable delete for users based on user_id" on "public"."event_grading_criteria";

drop policy "Enable insert for authenticated users only" on "public"."event_grading_criteria";

drop policy "Policy with table joins" on "public"."event_grading_criteria";

drop policy "Enable insert for authenticated users only" on "public"."events";

drop policy "Policy with table joins" on "public"."events";

drop policy "Enable delete for users based on user_id" on "public"."group_challenge";

drop policy "Policy with table joins" on "public"."group_challenge";

drop policy "Enable delete for users based on user_id" on "public"."groups";

drop policy "Policy with table joins" on "public"."groups";

drop policy "Enable delete for users based on user_id" on "public"."invitation";

drop policy "Enable insert for authenticated users only" on "public"."invitation";

drop policy "Policy with table joins" on "public"."invitation";

drop policy "Enable delete for users based on user_id" on "public"."profiles";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

drop policy "Enable delete for users based on user_id" on "public"."submission_files";

drop policy "Enable insert for authenticated users only" on "public"."submission_files";

drop policy "Policy with table joins" on "public"."submission_files";

drop policy "Enable delete for users based on user_id" on "public"."submission_grading";

drop policy "Enable insert for authenticated users only" on "public"."submission_grading";

drop policy "Policy with table joins" on "public"."submission_grading";

drop policy "Enable delete for users based on user_id" on "public"."submissions";

drop policy "Policy with table joins" on "public"."submissions";

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
  on "public"."event_challenges"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable insert for authenticated users only"
  on "public"."event_challenges"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Policy with table joins"
  on "public"."event_challenges"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable delete for users based on user_id"
  on "public"."event_grading_criteria"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable insert for authenticated users only"
  on "public"."event_grading_criteria"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Policy with table joins"
  on "public"."event_grading_criteria"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Enable insert for authenticated users only"
  on "public"."events"
  as permissive
  for insert
  to authenticated
with check ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = ( SELECT auth.uid() AS uid))) = 'admin'::public."PROFILE_ROLE"));



  create policy "Policy with table joins"
  on "public"."events"
  as permissive
  for update
  to authenticated
using ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = ( SELECT auth.uid() AS uid))) = 'admin'::public."PROFILE_ROLE"));



  create policy "Enable delete for users based on user_id"
  on "public"."group_challenge"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Policy with table joins"
  on "public"."group_challenge"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Enable delete for users based on user_id"
  on "public"."groups"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = groups.id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Policy with table joins"
  on "public"."groups"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = groups.id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Enable delete for users based on user_id"
  on "public"."invitation"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.email = invitation.member_email)))));



  create policy "Enable insert for authenticated users only"
  on "public"."invitation"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.email = invitation.member_email)))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.member_id = ( SELECT auth.uid() AS uid)) AND (group_members.group_id = invitation.group_id))))));



  create policy "Policy with table joins"
  on "public"."invitation"
  as permissive
  for update
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.email = invitation.member_email)))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.member_id = ( SELECT auth.uid() AS uid)) AND (group_members.group_id = invitation.group_id))))));



  create policy "Enable delete for users based on user_id"
  on "public"."profiles"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.uid() AS uid) = id) OR (role <> ALL (ARRAY['admin'::public."PROFILE_ROLE", 'judge'::public."PROFILE_ROLE"]))));



  create policy "Users can insert their own profile."
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can update own profile."
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Enable delete for users based on user_id"
  on "public"."submission_files"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submission_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_files"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submission_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Policy with table joins"
  on "public"."submission_files"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submission_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Enable delete for users based on user_id"
  on "public"."submission_grading"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE"))))));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_grading"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE"))))));



  create policy "Policy with table joins"
  on "public"."submission_grading"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND ((profiles.role = 'admin'::public."PROFILE_ROLE") OR (profiles.role = 'judge'::public."PROFILE_ROLE"))))));



  create policy "Enable delete for users based on user_id"
  on "public"."submissions"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submissions.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Policy with table joins"
  on "public"."submissions"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submissions.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid))))));



