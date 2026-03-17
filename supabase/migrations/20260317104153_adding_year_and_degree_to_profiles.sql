create type "public"."DEGREE" as enum ('Bachelor', 'Master', 'Ph.D');

create type "public"."YEAR" as enum ('First Year', 'Second Year', 'Third Year', 'Fourth Year');

alter table "public"."profiles" add column "degree" public."DEGREE";

alter table "public"."profiles" add column "year" public."YEAR";

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


