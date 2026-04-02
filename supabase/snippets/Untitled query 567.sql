ALTER TABLE submission_feedbacks 
ADD CONSTRAINT unique_submission_user UNIQUE (submission_id, user_id);