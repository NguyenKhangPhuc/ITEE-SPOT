
  create table "public"."submission_comments" (
    "id" uuid not null default gen_random_uuid(),
    "submission_id" uuid,
    "user_id" uuid,
    "display_name" text,
    "content" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."submission_comments" enable row level security;

CREATE UNIQUE INDEX submission_comments_pkey ON public.submission_comments USING btree (id);

alter table "public"."submission_comments" add constraint "submission_comments_pkey" PRIMARY KEY using index "submission_comments_pkey";

alter table "public"."submission_comments" add constraint "submission_comments_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_comments" validate constraint "submission_comments_submission_id_fkey";

alter table "public"."submission_comments" add constraint "submission_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_comments" validate constraint "submission_comments_user_id_fkey";

grant delete on table "public"."submission_comments" to "anon";

grant insert on table "public"."submission_comments" to "anon";

grant references on table "public"."submission_comments" to "anon";

grant select on table "public"."submission_comments" to "anon";

grant trigger on table "public"."submission_comments" to "anon";

grant truncate on table "public"."submission_comments" to "anon";

grant update on table "public"."submission_comments" to "anon";

grant delete on table "public"."submission_comments" to "authenticated";

grant insert on table "public"."submission_comments" to "authenticated";

grant references on table "public"."submission_comments" to "authenticated";

grant select on table "public"."submission_comments" to "authenticated";

grant trigger on table "public"."submission_comments" to "authenticated";

grant truncate on table "public"."submission_comments" to "authenticated";

grant update on table "public"."submission_comments" to "authenticated";

grant delete on table "public"."submission_comments" to "postgres";

grant insert on table "public"."submission_comments" to "postgres";

grant references on table "public"."submission_comments" to "postgres";

grant select on table "public"."submission_comments" to "postgres";

grant trigger on table "public"."submission_comments" to "postgres";

grant truncate on table "public"."submission_comments" to "postgres";

grant update on table "public"."submission_comments" to "postgres";

grant delete on table "public"."submission_comments" to "service_role";

grant insert on table "public"."submission_comments" to "service_role";

grant references on table "public"."submission_comments" to "service_role";

grant select on table "public"."submission_comments" to "service_role";

grant trigger on table "public"."submission_comments" to "service_role";

grant truncate on table "public"."submission_comments" to "service_role";

grant update on table "public"."submission_comments" to "service_role";

grant delete on table "public"."submission_files" to "postgres";

grant insert on table "public"."submission_files" to "postgres";

grant references on table "public"."submission_files" to "postgres";

grant select on table "public"."submission_files" to "postgres";

grant trigger on table "public"."submission_files" to "postgres";

grant truncate on table "public"."submission_files" to "postgres";

grant update on table "public"."submission_files" to "postgres";

grant delete on table "public"."submission_reactions" to "postgres";

grant insert on table "public"."submission_reactions" to "postgres";

grant references on table "public"."submission_reactions" to "postgres";

grant select on table "public"."submission_reactions" to "postgres";

grant trigger on table "public"."submission_reactions" to "postgres";

grant truncate on table "public"."submission_reactions" to "postgres";

grant update on table "public"."submission_reactions" to "postgres";


  create policy "Enable delete for users based on user_id"
  on "public"."submission_comments"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_comments"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."submission_comments"
  as permissive
  for select
  to authenticated
using (true);



