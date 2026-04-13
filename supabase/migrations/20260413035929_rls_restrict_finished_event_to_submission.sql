drop policy "Enable insert for authenticated users only" on "public"."submissions";

drop policy "Policy with table joins" on "public"."submissions";

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


  create policy "Enable insert for authenticated users only"
  on "public"."submissions"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM (public.groups g
     JOIN public.events e ON ((g.event_id = e.id)))
  WHERE ((g.id = submissions.group_id) AND (e.status <> 'finished'::public."EVENT_STATUS")))) AND (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submissions.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



  create policy "Policy with table joins"
  on "public"."submissions"
  as permissive
  for update
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.groups g
     JOIN public.events e ON ((g.event_id = e.id)))
  WHERE ((g.id = submissions.group_id) AND (e.status <> 'finished'::public."EVENT_STATUS")))) AND (EXISTS ( SELECT 1
   FROM public.group_members
  WHERE ((group_members.group_id = submissions.group_id) AND (group_members.member_id = ( SELECT auth.uid() AS uid)))))));



