set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_storage_file()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  delete from storage.objects where bucket_id = 'attachments' and name = old.storage_path;
  return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'email'
    );
  return new;
end;
$function$
;

grant delete on table "public"."event_challenges" to "postgres";

grant insert on table "public"."event_challenges" to "postgres";

grant references on table "public"."event_challenges" to "postgres";

grant select on table "public"."event_challenges" to "postgres";

grant trigger on table "public"."event_challenges" to "postgres";

grant truncate on table "public"."event_challenges" to "postgres";

grant update on table "public"."event_challenges" to "postgres";

grant delete on table "public"."events" to "postgres";

grant insert on table "public"."events" to "postgres";

grant references on table "public"."events" to "postgres";

grant select on table "public"."events" to "postgres";

grant trigger on table "public"."events" to "postgres";

grant truncate on table "public"."events" to "postgres";

grant update on table "public"."events" to "postgres";

grant delete on table "public"."group_challenge" to "postgres";

grant insert on table "public"."group_challenge" to "postgres";

grant references on table "public"."group_challenge" to "postgres";

grant select on table "public"."group_challenge" to "postgres";

grant trigger on table "public"."group_challenge" to "postgres";

grant truncate on table "public"."group_challenge" to "postgres";

grant update on table "public"."group_challenge" to "postgres";

grant delete on table "public"."group_members" to "postgres";

grant insert on table "public"."group_members" to "postgres";

grant references on table "public"."group_members" to "postgres";

grant select on table "public"."group_members" to "postgres";

grant trigger on table "public"."group_members" to "postgres";

grant truncate on table "public"."group_members" to "postgres";

grant update on table "public"."group_members" to "postgres";

grant delete on table "public"."groups" to "postgres";

grant insert on table "public"."groups" to "postgres";

grant references on table "public"."groups" to "postgres";

grant select on table "public"."groups" to "postgres";

grant trigger on table "public"."groups" to "postgres";

grant truncate on table "public"."groups" to "postgres";

grant update on table "public"."groups" to "postgres";

grant delete on table "public"."invitation" to "postgres";

grant insert on table "public"."invitation" to "postgres";

grant references on table "public"."invitation" to "postgres";

grant select on table "public"."invitation" to "postgres";

grant trigger on table "public"."invitation" to "postgres";

grant truncate on table "public"."invitation" to "postgres";

grant update on table "public"."invitation" to "postgres";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."submission_file" to "postgres";

grant insert on table "public"."submission_file" to "postgres";

grant references on table "public"."submission_file" to "postgres";

grant select on table "public"."submission_file" to "postgres";

grant trigger on table "public"."submission_file" to "postgres";

grant truncate on table "public"."submission_file" to "postgres";

grant update on table "public"."submission_file" to "postgres";

grant delete on table "public"."submissions" to "postgres";

grant insert on table "public"."submissions" to "postgres";

grant references on table "public"."submissions" to "postgres";

grant select on table "public"."submissions" to "postgres";

grant trigger on table "public"."submissions" to "postgres";

grant truncate on table "public"."submissions" to "postgres";

grant update on table "public"."submissions" to "postgres";


  create policy "Enable delete for users based on user_id"
  on "public"."submission_file"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."submission_file"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."submission_file"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."submission_file"
  as permissive
  for update
  to authenticated
using (true);


CREATE TRIGGER trigger_delete_file_on_storage AFTER DELETE ON public.submission_file FOR EACH ROW EXECUTE FUNCTION public.delete_storage_file();


