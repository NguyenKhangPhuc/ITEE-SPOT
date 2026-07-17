drop policy "Enable read access for all users" on "public"."event_grading_criteria";

drop policy "Enable read access for all users" on "public"."submission_grading";

drop policy "Enable read access for all users" on "public"."submissions";


  create policy "Only non-students can view event_grading_criteria"
  on "public"."event_grading_criteria"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role <> 'student'::public."PROFILE_ROLE")))));



  create policy "Only non-students can view submission_grading"
  on "public"."submission_grading"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role <> 'student'::public."PROFILE_ROLE")))));



  create policy "Non-students or group members can view submissions"
  on "public"."submissions"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role <> 'student'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members gm
  WHERE ((gm.group_id = submissions.group_id) AND (gm.member_id = ( SELECT auth.uid() AS uid)))))));



