
  create table "public"."submission_file" (
    "id" uuid not null default gen_random_uuid(),
    "submission_id" uuid default gen_random_uuid(),
    "group_id" uuid,
    "original_file_name" text,
    "storage_path" text,
    "mime_tpye" text,
    "size" bigint,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."submission_file" enable row level security;

CREATE UNIQUE INDEX submission_file_pkey ON public.submission_file USING btree (id);

alter table "public"."submission_file" add constraint "submission_file_pkey" PRIMARY KEY using index "submission_file_pkey";

alter table "public"."submission_file" add constraint "submission_file_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_file" validate constraint "submission_file_group_id_fkey";

alter table "public"."submission_file" add constraint "submission_file_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_file" validate constraint "submission_file_submission_id_fkey";

set check_function_bodies = off;

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

grant delete on table "public"."submission_file" to "anon";

grant insert on table "public"."submission_file" to "anon";

grant references on table "public"."submission_file" to "anon";

grant select on table "public"."submission_file" to "anon";

grant trigger on table "public"."submission_file" to "anon";

grant truncate on table "public"."submission_file" to "anon";

grant update on table "public"."submission_file" to "anon";

grant delete on table "public"."submission_file" to "authenticated";

grant insert on table "public"."submission_file" to "authenticated";

grant references on table "public"."submission_file" to "authenticated";

grant select on table "public"."submission_file" to "authenticated";

grant trigger on table "public"."submission_file" to "authenticated";

grant truncate on table "public"."submission_file" to "authenticated";

grant update on table "public"."submission_file" to "authenticated";

grant delete on table "public"."submission_file" to "postgres";

grant insert on table "public"."submission_file" to "postgres";

grant references on table "public"."submission_file" to "postgres";

grant select on table "public"."submission_file" to "postgres";

grant trigger on table "public"."submission_file" to "postgres";

grant truncate on table "public"."submission_file" to "postgres";

grant update on table "public"."submission_file" to "postgres";

grant delete on table "public"."submission_file" to "service_role";

grant insert on table "public"."submission_file" to "service_role";

grant references on table "public"."submission_file" to "service_role";

grant select on table "public"."submission_file" to "service_role";

grant trigger on table "public"."submission_file" to "service_role";

grant truncate on table "public"."submission_file" to "service_role";

grant update on table "public"."submission_file" to "service_role";

grant delete on table "public"."submissions" to "postgres";

grant insert on table "public"."submissions" to "postgres";

grant references on table "public"."submissions" to "postgres";

grant select on table "public"."submissions" to "postgres";

grant trigger on table "public"."submissions" to "postgres";

grant truncate on table "public"."submissions" to "postgres";

grant update on table "public"."submissions" to "postgres";


  create policy "Policy with table joins"
  on "public"."invitation"
  as permissive
  for update
  to authenticated
using (true);



