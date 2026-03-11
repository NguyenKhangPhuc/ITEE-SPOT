create type "public"."PROFILE_ROLE" as enum ('admin', 'student', 'judge');

alter table "public"."profiles" add column "role" public."PROFILE_ROLE" default 'student'::public."PROFILE_ROLE";

grant delete on table "public"."submission_files" to "postgres";

grant insert on table "public"."submission_files" to "postgres";

grant references on table "public"."submission_files" to "postgres";

grant select on table "public"."submission_files" to "postgres";

grant trigger on table "public"."submission_files" to "postgres";

grant truncate on table "public"."submission_files" to "postgres";

grant update on table "public"."submission_files" to "postgres";


  create policy "Enable delete for users based on user_id"
  on "public"."submission_files"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."submission_files"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."submission_files"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "storage"."objects"
  as permissive
  for select
  to public
using (true);



