create view submission_final_scores as
with user_total_per_submission as (
  -- Bước 1: Tính tổng điểm của từng User cho mỗi Submission dựa trên trọng số %
  select 
    sg.submission_id,
    sg.user_id,
    sum(sg.grade * (c.percentage / 100.0)) as user_total
  from submission_grading sg
  join event_grading_criteria c on sg.event_criteria_id = c.id
  group by sg.submission_id, sg.user_id
)
-- Bước 2: Tính trung bình cộng từ tất cả các User
select 
  submission_id,
  avg(user_total) as final_average_score,
  count(user_id) as total_graders
from user_total_per_submission
group by submission_id;