ALTER TABLE submissions
ADD CONSTRAINT unique_group_submission 
UNIQUE (group_id, group_challenge_id);