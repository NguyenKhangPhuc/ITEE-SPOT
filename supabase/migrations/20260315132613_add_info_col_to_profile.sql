create type "public"."PROGRAMME" as enum ('Information Processing Science', 'Electronics and Communications Engineering', 'Computer Science and Engineering', 'Biomedical Engineering');

create type "public"."UNIVERSITY" as enum ('University of Oulu', 'Oulu University of Applied Science');

alter table "public"."profiles" add column "company_name" text;

alter table "public"."profiles" add column "programme" public."PROGRAMME";

alter table "public"."profiles" add column "university" public."UNIVERSITY";

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

grant delete on table "public"."submission_reactions" to "postgres";

grant insert on table "public"."submission_reactions" to "postgres";

grant references on table "public"."submission_reactions" to "postgres";

grant select on table "public"."submission_reactions" to "postgres";

grant trigger on table "public"."submission_reactions" to "postgres";

grant truncate on table "public"."submission_reactions" to "postgres";

grant update on table "public"."submission_reactions" to "postgres";


