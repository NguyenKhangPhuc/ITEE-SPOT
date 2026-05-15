drop policy "Enable read access for all users" on "public"."project_files";


  create policy "Enable read access for all users"
  on "public"."project_files"
  as permissive
  for select
  to public
using (true);



