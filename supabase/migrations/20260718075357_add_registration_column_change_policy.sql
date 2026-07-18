drop policy "Enable insert for authenticated users only" on "public"."groups";

alter table "public"."events" add column "registration_status" public."EVENT_STATUS";


  create policy "Can only insert groups when event registration is ongoing"
  on "public"."groups"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.events e
  WHERE ((e.id = groups.event_id) AND (e.registration_status = 'ongoing'::public."EVENT_STATUS")))));



