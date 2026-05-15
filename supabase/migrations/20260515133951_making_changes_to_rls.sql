drop policy "Enable read access for all users" on "public"."event_challenges";

drop policy "Enable read access for all authenticated users" on "public"."events";

drop policy "Enable read access for all users" on "public"."group_members";

drop policy "Enable read access for all users" on "public"."groups";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";


  create policy "Enable read access for all users"
  on "public"."event_challenges"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all authenticated users"
  on "public"."events"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."group_members"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
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



