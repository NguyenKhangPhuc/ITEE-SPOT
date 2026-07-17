-- =========================================================
-- INSERT: admin hoặc thành viên của group đó
-- =========================================================
CREATE POLICY "Admin or group members can insert group_challenge"
ON group_challenge FOR INSERT
TO authenticated
WITH CHECK (
  (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  )
  OR
  (
    EXISTS (
      SELECT 1
      FROM group_members
      WHERE (group_members.group_id = group_challenge.group_id)
      AND (group_members.member_id = (SELECT auth.uid()))
    )
  )
);

-- =========================================================
-- UPDATE: admin hoặc thành viên của group đó
-- =========================================================
CREATE POLICY "Admin or group members can update group_challenge"
ON group_challenge FOR UPDATE
TO authenticated
USING (
  (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  )
  OR
  (
    EXISTS (
      SELECT 1
      FROM group_members
      WHERE (group_members.group_id = group_challenge.group_id)
      AND (group_members.member_id = (SELECT auth.uid()))
    )
  )
)
WITH CHECK (
  (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  )
  OR
  (
    EXISTS (
      SELECT 1
      FROM group_members
      WHERE (group_members.group_id = group_challenge.group_id)
      AND (group_members.member_id = (SELECT auth.uid()))
    )
  )
);

-- =========================================================
-- DELETE: admin hoặc thành viên của group đó
-- =========================================================
CREATE POLICY "Admin or group members can delete group_challenge"
ON group_challenge FOR DELETE
TO authenticated
USING (
  (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  )
  OR
  (
    EXISTS (
      SELECT 1
      FROM group_members
      WHERE (group_members.group_id = group_challenge.group_id)
      AND (group_members.member_id = (SELECT auth.uid()))
    )
  )
);