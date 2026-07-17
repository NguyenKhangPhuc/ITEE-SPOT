drop policy "Enable delete for users based on user_id" on "public"."group_challenge";

drop policy "Enable insert for authenticated users only" on "public"."group_challenge";

drop policy "Policy with table joins" on "public"."group_challenge";


  create policy "Admin or group members can delete group_challenge"
  on "public"."group_challenge"
  as permissive
  for delete
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Admin or group members can insert group_challenge"
  on "public"."group_challenge"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Admin or group members can update group_challenge"
  on "public"."group_challenge"
  as permissive
  for update
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))))
with check (((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



