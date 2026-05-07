

ALTER TABLE "public"."projects" 
ADD CONSTRAINT projects_group_challenge_unique UNIQUE (group_id, group_challenge_id);