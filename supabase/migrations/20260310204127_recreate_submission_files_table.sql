
  create table "public"."submission_files" (
    "id" uuid not null default gen_random_uuid(),
    "group_id" uuid,
    "submission_id" uuid,
    "storage_path" text,
    "original_file_name" text,
    "mime_type" text,
    "size" bigint,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."submission_files" enable row level security;

CREATE UNIQUE INDEX submission_files_pkey ON public.submission_files USING btree (id);

alter table "public"."submission_files" add constraint "submission_files_pkey" PRIMARY KEY using index "submission_files_pkey";

alter table "public"."submission_files" add constraint "submission_files_group_id_fkey" FOREIGN KEY (group_id) REFERENCES public.groups(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_files" validate constraint "submission_files_group_id_fkey";

alter table "public"."submission_files" add constraint "submission_files_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."submission_files" validate constraint "submission_files_submission_id_fkey";

grant delete on table "public"."submission_files" to "anon";

grant insert on table "public"."submission_files" to "anon";

grant references on table "public"."submission_files" to "anon";

grant select on table "public"."submission_files" to "anon";

grant trigger on table "public"."submission_files" to "anon";

grant truncate on table "public"."submission_files" to "anon";

grant update on table "public"."submission_files" to "anon";

grant delete on table "public"."submission_files" to "authenticated";

grant insert on table "public"."submission_files" to "authenticated";

grant references on table "public"."submission_files" to "authenticated";

grant select on table "public"."submission_files" to "authenticated";

grant trigger on table "public"."submission_files" to "authenticated";

grant truncate on table "public"."submission_files" to "authenticated";

grant update on table "public"."submission_files" to "authenticated";

grant delete on table "public"."submission_files" to "postgres";

grant insert on table "public"."submission_files" to "postgres";

grant references on table "public"."submission_files" to "postgres";

grant select on table "public"."submission_files" to "postgres";

grant trigger on table "public"."submission_files" to "postgres";

grant truncate on table "public"."submission_files" to "postgres";

grant update on table "public"."submission_files" to "postgres";

grant delete on table "public"."submission_files" to "service_role";

grant insert on table "public"."submission_files" to "service_role";

grant references on table "public"."submission_files" to "service_role";

grant select on table "public"."submission_files" to "service_role";

grant trigger on table "public"."submission_files" to "service_role";

grant truncate on table "public"."submission_files" to "service_role";

grant update on table "public"."submission_files" to "service_role";


