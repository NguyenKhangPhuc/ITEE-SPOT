alter table public.submission_reactions
add constraint unique_user_submission_reaction 
unique (submission_id, user_id);