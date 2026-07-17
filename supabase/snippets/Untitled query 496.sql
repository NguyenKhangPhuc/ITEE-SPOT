CREATE POLICY "Admin or the member themselves can delete profile"
ON profiles FOR DELETE
TO authenticated
USING (
  (
    (SELECT auth.uid()) = id
  )
  OR
  (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  )
);

CREATE POLICY "Admin or the member themselves can update profile"
ON profiles FOR UPDATE
TO authenticated
USING (
  (
    (SELECT auth.uid()) = id
  )
  OR
  (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  )
);