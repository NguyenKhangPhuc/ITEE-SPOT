drop policy "Enable delete for users based on user_id" on "public"."project_awards";

drop policy "Enable insert for authenticated users only" on "public"."project_awards";

drop policy "Policy with table joins" on "public"."project_awards";


  create policy "Enable delete for users based on user_id"
  on "public"."project_awards"
  as permissive
  for delete
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM (public.projects
     JOIN public.group_members ON ((group_members.group_id = projects.group_id)))
  WHERE ((projects.id = project_awards.project_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Enable insert for authenticated users only"
  on "public"."project_awards"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM (public.projects
     JOIN public.group_members ON ((group_members.group_id = projects.group_id)))
  WHERE ((projects.id = project_awards.project_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Policy with table joins"
  on "public"."project_awards"
  as permissive
  for update
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.role = 'admin'::public."PROFILE_ROLE")))) OR (EXISTS ( SELECT 1
   FROM (public.projects
     JOIN public.group_members ON ((group_members.group_id = projects.group_id)))
  WHERE ((projects.id = project_awards.project_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



