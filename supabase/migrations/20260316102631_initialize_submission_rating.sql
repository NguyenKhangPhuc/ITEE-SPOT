
  create table "public"."submission_ratings" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "submission_id" uuid,
    "rating" smallint,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."submission_ratings" enable row level security;

CREATE UNIQUE INDEX submission_rating_pkey ON public.submission_ratings USING btree (id);

CREATE UNIQUE INDEX unique_user_submission_rating ON public.submission_ratings USING btree (user_id, submission_id);

alter table "public"."submission_ratings" add constraint "submission_rating_pkey" PRIMARY KEY using index "submission_rating_pkey";

alter table "public"."submission_ratings" add constraint "submission_rating_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_ratings" validate constraint "submission_rating_submission_id_fkey";

alter table "public"."submission_ratings" add constraint "submission_rating_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_ratings" validate constraint "submission_rating_user_id_fkey";

alter table "public"."submission_ratings" add constraint "unique_user_submission_rating" UNIQUE using index "unique_user_submission_rating";

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

grant delete on table "public"."submission_ratings" to "anon";

grant insert on table "public"."submission_ratings" to "anon";

grant references on table "public"."submission_ratings" to "anon";

grant select on table "public"."submission_ratings" to "anon";

grant trigger on table "public"."submission_ratings" to "anon";

grant truncate on table "public"."submission_ratings" to "anon";

grant update on table "public"."submission_ratings" to "anon";

grant delete on table "public"."submission_ratings" to "authenticated";

grant insert on table "public"."submission_ratings" to "authenticated";

grant references on table "public"."submission_ratings" to "authenticated";

grant select on table "public"."submission_ratings" to "authenticated";

grant trigger on table "public"."submission_ratings" to "authenticated";

grant truncate on table "public"."submission_ratings" to "authenticated";

grant update on table "public"."submission_ratings" to "authenticated";

grant delete on table "public"."submission_ratings" to "postgres";

grant insert on table "public"."submission_ratings" to "postgres";

grant references on table "public"."submission_ratings" to "postgres";

grant select on table "public"."submission_ratings" to "postgres";

grant trigger on table "public"."submission_ratings" to "postgres";

grant truncate on table "public"."submission_ratings" to "postgres";

grant update on table "public"."submission_ratings" to "postgres";

grant delete on table "public"."submission_ratings" to "service_role";

grant insert on table "public"."submission_ratings" to "service_role";

grant references on table "public"."submission_ratings" to "service_role";

grant select on table "public"."submission_ratings" to "service_role";

grant trigger on table "public"."submission_ratings" to "service_role";

grant truncate on table "public"."submission_ratings" to "service_role";

grant update on table "public"."submission_ratings" to "service_role";

grant delete on table "public"."submission_reactions" to "postgres";

grant insert on table "public"."submission_reactions" to "postgres";

grant references on table "public"."submission_reactions" to "postgres";

grant select on table "public"."submission_reactions" to "postgres";

grant trigger on table "public"."submission_reactions" to "postgres";

grant truncate on table "public"."submission_reactions" to "postgres";

grant update on table "public"."submission_reactions" to "postgres";


