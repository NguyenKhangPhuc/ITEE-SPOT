
  create table "public"."fun_facts" (
    "id" uuid not null default gen_random_uuid(),
    "fact" text,
    "submission_id" uuid,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."fun_facts" enable row level security;

CREATE UNIQUE INDEX fun_facts_pkey ON public.fun_facts USING btree (id);

alter table "public"."fun_facts" add constraint "fun_facts_pkey" PRIMARY KEY using index "fun_facts_pkey";

alter table "public"."fun_facts" add constraint "fun_facts_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fun_facts" validate constraint "fun_facts_submission_id_fkey";

grant delete on table "public"."fun_facts" to "anon";

grant insert on table "public"."fun_facts" to "anon";

grant references on table "public"."fun_facts" to "anon";

grant select on table "public"."fun_facts" to "anon";

grant trigger on table "public"."fun_facts" to "anon";

grant truncate on table "public"."fun_facts" to "anon";

grant update on table "public"."fun_facts" to "anon";

grant delete on table "public"."fun_facts" to "authenticated";

grant insert on table "public"."fun_facts" to "authenticated";

grant references on table "public"."fun_facts" to "authenticated";

grant select on table "public"."fun_facts" to "authenticated";

grant trigger on table "public"."fun_facts" to "authenticated";

grant truncate on table "public"."fun_facts" to "authenticated";

grant update on table "public"."fun_facts" to "authenticated";

grant delete on table "public"."fun_facts" to "postgres";

grant insert on table "public"."fun_facts" to "postgres";

grant references on table "public"."fun_facts" to "postgres";

grant select on table "public"."fun_facts" to "postgres";

grant trigger on table "public"."fun_facts" to "postgres";

grant truncate on table "public"."fun_facts" to "postgres";

grant update on table "public"."fun_facts" to "postgres";

grant delete on table "public"."fun_facts" to "service_role";

grant insert on table "public"."fun_facts" to "service_role";

grant references on table "public"."fun_facts" to "service_role";

grant select on table "public"."fun_facts" to "service_role";

grant trigger on table "public"."fun_facts" to "service_role";

grant truncate on table "public"."fun_facts" to "service_role";

grant update on table "public"."fun_facts" to "service_role";

grant delete on table "public"."submission_feedbacks" to "postgres";

grant insert on table "public"."submission_feedbacks" to "postgres";

grant references on table "public"."submission_feedbacks" to "postgres";

grant select on table "public"."submission_feedbacks" to "postgres";

grant trigger on table "public"."submission_feedbacks" to "postgres";

grant truncate on table "public"."submission_feedbacks" to "postgres";

grant update on table "public"."submission_feedbacks" to "postgres";


  create policy "Enable delete for users based on user_id"
  on "public"."fun_facts"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."fun_facts"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."fun_facts"
  as permissive
  for select
  to authenticated
using (true);



