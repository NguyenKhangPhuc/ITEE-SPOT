drop policy "Non-students or group members can view groups" on "public"."groups";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";


  create policy "Non-students or group members can view groups"
  on "public"."groups"
  as permissive
  for select
  to public
using (true);



  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



