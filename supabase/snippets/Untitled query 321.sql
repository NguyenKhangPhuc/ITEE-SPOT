ALTER TABLE submission_ratings
ADD CONSTRAINT unique_user_submission_rating UNIQUE (user_id, submission_id);