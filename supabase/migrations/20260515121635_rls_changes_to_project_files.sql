drop policy "Enable delete for users based on user_id" on "public"."project_files";

drop policy "Enable insert for authenticated users only" on "public"."project_files";

drop policy "Policy with table joins" on "public"."project_files";


  create policy "Enable delete for users based on user_id"
  on "public"."project_files"
  as permissive
  for delete
  to public
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = project_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Enable insert for authenticated users only"
  on "public"."project_files"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = project_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Policy with table joins"
  on "public"."project_files"
  as permissive
  for update
  to public
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = project_files.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



