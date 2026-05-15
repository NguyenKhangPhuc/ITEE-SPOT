grant delete on table "public"."project_awards" to "postgres";

grant insert on table "public"."project_awards" to "postgres";

grant references on table "public"."project_awards" to "postgres";

grant select on table "public"."project_awards" to "postgres";

grant trigger on table "public"."project_awards" to "postgres";

grant truncate on table "public"."project_awards" to "postgres";

grant update on table "public"."project_awards" to "postgres";


  create policy "Enable delete for users based on user_id"
  on "public"."project_awards"
  as permissive
  for delete
  to public
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."project_awards"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."project_awards"
  as permissive
  for select
  to public
using (true);



  create policy "Policy with table joins"
  on "public"."project_awards"
  as permissive
  for update
  to public
using (true);



