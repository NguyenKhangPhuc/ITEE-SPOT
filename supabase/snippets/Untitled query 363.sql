ALTER TABLE projects
ADD CONSTRAINT unique_project_group UNIQUE (group_id, group_challenge_id);