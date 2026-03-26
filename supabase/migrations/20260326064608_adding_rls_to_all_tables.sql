drop policy "Enable insert for authenticated users only" on "public"."event_challenges";

drop policy "Enable delete for users based on user_id" on "public"."events";

drop policy "Enable insert for authenticated users only" on "public"."events";

drop policy "Enable insert for authenticated users only" on "public"."group_challenge";

drop policy "Policy with table joins" on "public"."groups";

drop policy "Enable read access for all users" on "public"."invitation";

drop policy "Policy with table joins" on "public"."invitation";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

drop policy "Enable delete for users based on user_id" on "public"."submission_files";

drop policy "Enable insert for authenticated users only" on "public"."submission_files";

drop policy "Policy with table joins" on "public"."submissions";

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


  create policy "Policy with table joins"
  on "public"."event_challenges"
  as permissive
  for update
  to authenticated
using ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::public."PROFILE_ROLE"));



  create policy "Policy with table joins"
  on "public"."events"
  as permissive
  for update
  to authenticated
using ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::public."PROFILE_ROLE"));



  create policy "Enable delete for users based on user_id"
  on "public"."group_challenge"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = auth.uid())))));



  create policy "Policy with table joins"
  on "public"."group_challenge"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = auth.uid())))));



  create policy "Enable delete for users based on user_id"
  on "public"."group_members"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = member_id));



  create policy "Policy with table joins"
  on "public"."group_members"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = member_id));



  create policy "Enable delete for users based on user_id"
  on "public"."groups"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = groups.id) AND (group_members.member_id = auth.uid())))));



  create policy "Enable delete for users based on user_id"
  on "public"."invitation"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.email = invitation.member_email)))));



  create policy "Enable delete for users based on user_id"
  on "public"."profiles"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = id));



  create policy "Policy with table joins"
  on "public"."submission_comments"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Policy with table joins"
  on "public"."submission_files"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submission_files.group_id) AND (group_members.member_id = auth.uid())))));



  create policy "Policy with table joins"
  on "public"."submission_reactions"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable delete for users based on user_id"
  on "public"."submissions"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submissions.group_id) AND (group_members.member_id = auth.uid())))));



  create policy "Enable insert for authenticated users only"
  on "public"."event_challenges"
  as permissive
  for insert
  to authenticated
with check ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::public."PROFILE_ROLE"));



  create policy "Enable delete for users based on user_id"
  on "public"."events"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id));



  create policy "Enable insert for authenticated users only"
  on "public"."events"
  as permissive
  for insert
  to authenticated
with check ((( SELECT profiles.role
   FROM public.profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::public."PROFILE_ROLE"));



  create policy "Enable insert for authenticated users only"
  on "public"."group_challenge"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = group_challenge.group_id) AND (group_members.member_id = auth.uid())))));



  create policy "Policy with table joins"
  on "public"."groups"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = groups.id) AND (group_members.member_id = auth.uid())))));



  create policy "Enable read access for all users"
  on "public"."invitation"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.email = invitation.member_email)))));



  create policy "Policy with table joins"
  on "public"."invitation"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.email = invitation.member_email)))));



  create policy "Users can insert their own profile."
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = id));



  create policy "Users can update own profile."
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id));



  create policy "Enable delete for users based on user_id"
  on "public"."submission_files"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submission_files.group_id) AND (group_members.member_id = auth.uid())))));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_files"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submission_files.group_id) AND (group_members.member_id = auth.uid())))));



  create policy "Policy with table joins"
  on "public"."submissions"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submissions.group_id) AND (group_members.member_id = auth.uid())))));


drop policy "Enable insert for authenticated users only" on "storage"."objects";

drop policy "Enable read access for all users" on "storage"."objects";

drop policy "allow_authenticated 1mt4rzk_0" on "storage"."objects";

drop policy "allow_authenticated 1mt4rzk_1" on "storage"."objects";

drop policy "allow_authenticated 1mt4rzk_2" on "storage"."objects";

drop policy "allow_authenticated 1mt4rzk_3" on "storage"."objects";


