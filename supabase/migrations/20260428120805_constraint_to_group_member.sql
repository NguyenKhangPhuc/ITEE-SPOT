CREATE UNIQUE INDEX unique_group_member ON public.group_members USING btree (group_id, member_id);

alter table "public"."group_members" add constraint "unique_group_member" UNIQUE using index "unique_group_member";

grant delete on table "public"."fun_facts" to "postgres";

grant insert on table "public"."fun_facts" to "postgres";

grant references on table "public"."fun_facts" to "postgres";

grant select on table "public"."fun_facts" to "postgres";

grant trigger on table "public"."fun_facts" to "postgres";

grant truncate on table "public"."fun_facts" to "postgres";

grant update on table "public"."fun_facts" to "postgres";

grant delete on table "public"."submission_feedbacks" to "postgres";

grant insert on table "public"."submission_feedbacks" to "postgres";

grant references on table "public"."submission_feedbacks" to "postgres";

grant select on table "public"."submission_feedbacks" to "postgres";

grant trigger on table "public"."submission_feedbacks" to "postgres";

grant truncate on table "public"."submission_feedbacks" to "postgres";

grant update on table "public"."submission_feedbacks" to "postgres";


