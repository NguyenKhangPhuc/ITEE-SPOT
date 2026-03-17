alter table "public"."groups" add column "poster_path" text;

grant delete on table "public"."submission_comments" to "postgres";

grant insert on table "public"."submission_comments" to "postgres";

grant references on table "public"."submission_comments" to "postgres";

grant select on table "public"."submission_comments" to "postgres";

grant trigger on table "public"."submission_comments" to "postgres";

grant truncate on table "public"."submission_comments" to "postgres";

grant update on table "public"."submission_comments" to "postgres";

grant delete on table "public"."submission_files" to "postgres";

grant insert on table "public"."submission_files" to "postgres";

grant references on table "public"."submission_files" to "postgres";

grant select on table "public"."submission_files" to "postgres";

grant trigger on table "public"."submission_files" to "postgres";

grant truncate on table "public"."submission_files" to "postgres";

grant update on table "public"."submission_files" to "postgres";

grant delete on table "public"."submission_ratings" to "postgres";

grant insert on table "public"."submission_ratings" to "postgres";

grant references on table "public"."submission_ratings" to "postgres";

grant select on table "public"."submission_ratings" to "postgres";

grant trigger on table "public"."submission_ratings" to "postgres";

grant truncate on table "public"."submission_ratings" to "postgres";

grant update on table "public"."submission_ratings" to "postgres";

grant delete on table "public"."submission_reactions" to "postgres";

grant insert on table "public"."submission_reactions" to "postgres";

grant references on table "public"."submission_reactions" to "postgres";

grant select on table "public"."submission_reactions" to "postgres";

grant trigger on table "public"."submission_reactions" to "postgres";

grant truncate on table "public"."submission_reactions" to "postgres";

grant update on table "public"."submission_reactions" to "postgres";


  create policy "Enable delete for users based on user_id"
  on "public"."submission_ratings"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_ratings"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."submission_ratings"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."submission_ratings"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



