drop policy "Enable insert for authenticated users only" on "public"."group_challenge";


  create policy "Enable insert for authenticated users only"
  on "public"."group_challenge"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "allow_authenticated 1mt4rzk_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'attachments'::text));



  create policy "allow_authenticated 1mt4rzk_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'attachments'::text));



  create policy "allow_authenticated 1mt4rzk_2"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'attachments'::text));



  create policy "allow_authenticated 1mt4rzk_3"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'attachments'::text));



