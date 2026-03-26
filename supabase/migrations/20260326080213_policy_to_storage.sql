
  create policy "allow_authenticated_delete"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "allow_authenticated_select"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (true);



  create policy "authenticated_insert"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (true);



