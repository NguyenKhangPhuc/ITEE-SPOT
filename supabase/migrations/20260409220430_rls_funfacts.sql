drop policy "Enable delete for users based on user_id" on "public"."fun_facts";

drop policy "Enable insert for authenticated users only" on "public"."fun_facts";

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


  create policy "Enable delete for users based on user_id"
  on "public"."fun_facts"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.submissions s
     JOIN public.group_members gm ON ((s.group_id = gm.group_id)))
  WHERE ((s.id = fun_facts.submission_id) AND (gm.member_id = ( SELECT auth.uid() AS uid))))));



  create policy "Enable insert for authenticated users only"
  on "public"."fun_facts"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM (public.submissions s
     JOIN public.group_members gm ON ((s.group_id = gm.group_id)))
  WHERE ((s.id = fun_facts.submission_id) AND (gm.member_id = ( SELECT auth.uid() AS uid))))));



