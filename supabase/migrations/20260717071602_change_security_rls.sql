drop policy "Enable delete for users based on user_id" on "public"."group_members";

drop policy "Enable delete for users based on user_id" on "public"."groups";

drop policy "Enable read access for all users" on "public"."groups";

drop policy "Enable delete for users based on user_id" on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";


  create policy "Admin or the member themselves can delete"
  on "public"."group_members"
  as permissive
  for delete
  to authenticated
using (((( SELECT auth.uid() AS uid) = member_id) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::public."PROFILE_ROLE"))))));



  create policy "Non-students or group members can view groups"
  on "public"."groups"
  as permissive
  for select
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role <> 'student'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = groups.id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Only admin can delete groups"
  on "public"."groups"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::public."PROFILE_ROLE")))));



  create policy "Admin or the member themselves can delete profile"
  on "public"."profiles"
  as permissive
  for delete
  to authenticated
using (((( SELECT auth.uid() AS uid) = id) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::public."PROFILE_ROLE"))))));



  create policy "Admin or the member themselves can update profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using (((( SELECT auth.uid() AS uid) = id) OR (EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::public."PROFILE_ROLE"))))));



  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (true);



