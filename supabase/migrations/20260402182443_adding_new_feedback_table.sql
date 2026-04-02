
  create table "public"."submission_feedbacks" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "submission_id" uuid,
    "display_name" text,
    "content" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."submission_feedbacks" enable row level security;

CREATE UNIQUE INDEX submission_feedbacks_pkey ON public.submission_feedbacks USING btree (id);

alter table "public"."submission_feedbacks" add constraint "submission_feedbacks_pkey" PRIMARY KEY using index "submission_feedbacks_pkey";

alter table "public"."submission_feedbacks" add constraint "submission_feedbacks_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_feedbacks" validate constraint "submission_feedbacks_submission_id_fkey";

alter table "public"."submission_feedbacks" add constraint "submission_feedbacks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_feedbacks" validate constraint "submission_feedbacks_user_id_fkey";

grant delete on table "public"."submission_feedbacks" to "anon";

grant insert on table "public"."submission_feedbacks" to "anon";

grant references on table "public"."submission_feedbacks" to "anon";

grant select on table "public"."submission_feedbacks" to "anon";

grant trigger on table "public"."submission_feedbacks" to "anon";

grant truncate on table "public"."submission_feedbacks" to "anon";

grant update on table "public"."submission_feedbacks" to "anon";

grant delete on table "public"."submission_feedbacks" to "authenticated";

grant insert on table "public"."submission_feedbacks" to "authenticated";

grant references on table "public"."submission_feedbacks" to "authenticated";

grant select on table "public"."submission_feedbacks" to "authenticated";

grant trigger on table "public"."submission_feedbacks" to "authenticated";

grant truncate on table "public"."submission_feedbacks" to "authenticated";

grant update on table "public"."submission_feedbacks" to "authenticated";

grant delete on table "public"."submission_feedbacks" to "postgres";

grant insert on table "public"."submission_feedbacks" to "postgres";

grant references on table "public"."submission_feedbacks" to "postgres";

grant select on table "public"."submission_feedbacks" to "postgres";

grant trigger on table "public"."submission_feedbacks" to "postgres";

grant truncate on table "public"."submission_feedbacks" to "postgres";

grant update on table "public"."submission_feedbacks" to "postgres";

grant delete on table "public"."submission_feedbacks" to "service_role";

grant insert on table "public"."submission_feedbacks" to "service_role";

grant references on table "public"."submission_feedbacks" to "service_role";

grant select on table "public"."submission_feedbacks" to "service_role";

grant trigger on table "public"."submission_feedbacks" to "service_role";

grant truncate on table "public"."submission_feedbacks" to "service_role";

grant update on table "public"."submission_feedbacks" to "service_role";


  create policy "Enable delete for users based on user_id"
  on "public"."submission_feedbacks"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for authenticated users only"
  on "public"."submission_feedbacks"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."submission_feedbacks"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Policy with table joins"
  on "public"."submission_feedbacks"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



