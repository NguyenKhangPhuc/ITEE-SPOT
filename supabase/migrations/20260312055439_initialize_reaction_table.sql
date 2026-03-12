
  create table "public"."submission_reactions" (
    "id" uuid not null default gen_random_uuid(),
    "submission_id" uuid,
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."submission_reactions" enable row level security;

CREATE UNIQUE INDEX submission_reactions_pkey ON public.submission_reactions USING btree (id);

CREATE UNIQUE INDEX unique_user_submission_reaction ON public.submission_reactions USING btree (submission_id, user_id);

alter table "public"."submission_reactions" add constraint "submission_reactions_pkey" PRIMARY KEY using index "submission_reactions_pkey";

alter table "public"."submission_reactions" add constraint "submission_reactions_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_reactions" validate constraint "submission_reactions_submission_id_fkey";

alter table "public"."submission_reactions" add constraint "submission_reactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_reactions" validate constraint "submission_reactions_user_id_fkey";

alter table "public"."submission_reactions" add constraint "unique_user_submission_reaction" UNIQUE using index "unique_user_submission_reaction";

grant delete on table "public"."submission_files" to "postgres";

grant insert on table "public"."submission_files" to "postgres";

grant references on table "public"."submission_files" to "postgres";

grant select on table "public"."submission_files" to "postgres";

grant trigger on table "public"."submission_files" to "postgres";

grant truncate on table "public"."submission_files" to "postgres";

grant update on table "public"."submission_files" to "postgres";

grant delete on table "public"."submission_reactions" to "anon";

grant insert on table "public"."submission_reactions" to "anon";

grant references on table "public"."submission_reactions" to "anon";

grant select on table "public"."submission_reactions" to "anon";

grant trigger on table "public"."submission_reactions" to "anon";

grant truncate on table "public"."submission_reactions" to "anon";

grant update on table "public"."submission_reactions" to "anon";

grant delete on table "public"."submission_reactions" to "authenticated";

grant insert on table "public"."submission_reactions" to "authenticated";

grant references on table "public"."submission_reactions" to "authenticated";

grant select on table "public"."submission_reactions" to "authenticated";

grant trigger on table "public"."submission_reactions" to "authenticated";

grant truncate on table "public"."submission_reactions" to "authenticated";

grant update on table "public"."submission_reactions" to "authenticated";

grant delete on table "public"."submission_reactions" to "postgres";

grant insert on table "public"."submission_reactions" to "postgres";

grant references on table "public"."submission_reactions" to "postgres";

grant select on table "public"."submission_reactions" to "postgres";

grant trigger on table "public"."submission_reactions" to "postgres";

grant truncate on table "public"."submission_reactions" to "postgres";

grant update on table "public"."submission_reactions" to "postgres";

grant delete on table "public"."submission_reactions" to "service_role";

grant insert on table "public"."submission_reactions" to "service_role";

grant references on table "public"."submission_reactions" to "service_role";

grant select on table "public"."submission_reactions" to "service_role";

grant trigger on table "public"."submission_reactions" to "service_role";

grant truncate on table "public"."submission_reactions" to "service_role";

grant update on table "public"."submission_reactions" to "service_role";


  create policy "Enable delete for users based on user_id"
  on "public"."submission_reactions"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_reactions"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."submission_reactions"
  as permissive
  for select
  to authenticated
using (true);



