ALTER TABLE submission_grading 
ADD CONSTRAINT unique_user_submission_criteria 
UNIQUE (user_id, submission_id, event_criteria_id);