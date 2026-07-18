CREATE POLICY "Can only insert groups when event registration is ongoing"
ON groups FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events e
    WHERE e.id = groups.event_id
    AND e.registration_status = 'ongoing'
  )
);