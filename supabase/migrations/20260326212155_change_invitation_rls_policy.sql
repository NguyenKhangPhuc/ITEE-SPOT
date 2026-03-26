drop policy "Enable insert for authenticated users only" on "public"."invitation";

drop policy "Enable read access for all users" on "public"."invitation";

drop policy "Policy with table joins" on "public"."invitation";


  create policy "Enable insert for authenticated users only"
  on "public"."invitation"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.email = invitation.member_email)))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.member_id = auth.uid()) AND (group_members.group_id = invitation.group_id))))));



  create policy "Enable read access for all users"
  on "public"."invitation"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."invitation"
  as permissive
  for update
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.email = invitation.member_email)))) OR (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.member_id = auth.uid()) AND (group_members.group_id = invitation.group_id))))));



