alter type "public"."AWARD_TYPE" rename to "AWARD_TYPE__old_version_to_be_dropped";

create type "public"."AWARD_TYPE" as enum ('general', 'specific', 'participant');

alter table "public"."event_awards" alter column award_type type "public"."AWARD_TYPE" using award_type::text::"public"."AWARD_TYPE";

drop type "public"."AWARD_TYPE__old_version_to_be_dropped";

grant delete on table "public"."event_awards" to "postgres";

grant insert on table "public"."event_awards" to "postgres";

grant references on table "public"."event_awards" to "postgres";

grant select on table "public"."event_awards" to "postgres";

grant trigger on table "public"."event_awards" to "postgres";

grant truncate on table "public"."event_awards" to "postgres";

grant update on table "public"."event_awards" to "postgres";

grant delete on table "public"."fun_facts" to "postgres";

grant insert on table "public"."fun_facts" to "postgres";

grant references on table "public"."fun_facts" to "postgres";

grant select on table "public"."fun_facts" to "postgres";

grant trigger on table "public"."fun_facts" to "postgres";

grant truncate on table "public"."fun_facts" to "postgres";

grant update on table "public"."fun_facts" to "postgres";

grant delete on table "public"."projects" to "postgres";

grant insert on table "public"."projects" to "postgres";

grant references on table "public"."projects" to "postgres";

grant select on table "public"."projects" to "postgres";

grant trigger on table "public"."projects" to "postgres";

grant truncate on table "public"."projects" to "postgres";

grant update on table "public"."projects" to "postgres";

grant delete on table "public"."submission_feedbacks" to "postgres";

grant insert on table "public"."submission_feedbacks" to "postgres";

grant references on table "public"."submission_feedbacks" to "postgres";

grant select on table "public"."submission_feedbacks" to "postgres";

grant trigger on table "public"."submission_feedbacks" to "postgres";

grant truncate on table "public"."submission_feedbacks" to "postgres";

grant update on table "public"."submission_feedbacks" to "postgres";


