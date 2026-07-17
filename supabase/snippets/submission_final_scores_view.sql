CREATE OR REPLACE view submission_ratings_cell as
select
  sr.submission_id,
  avg(sr.rating) as avg_rating,
  count(sr.user_id) as total_raters,
  jsonb_agg(
    jsonb_build_object(
      'user_id', sr.user_id,
      'user_name', p.full_name,
      'rating', sr.rating
    )
    order by sr.user_id
  ) as raters
from submission_ratings sr
join profiles p on p.id = sr.user_id
group by sr.submission_id;
-- =========================================================
-- 1. Breakdown từng user theo từng NORMAL criteria
-- =========================================================
CREATE OR REPLACE view submission_criteria_user_grades as
select
  sg.submission_id,
  c.id as criteria_id,
  c.criteria_name,
  c.percentage,
  sg.user_id,
  p.full_name as user_name,
  sg.grade,
  sg.grade * (c.percentage / 100.0) as weighted_score
from submission_grading sg
join event_grading_criteria c on sg.event_criteria_id = c.id
join profiles p on p.id = sg.user_id
where c.type = 'normal';

-- =========================================================
-- 2. Gộp cell (avg_score + graders) theo từng NORMAL criteria
-- =========================================================
CREATE OR REPLACE view submission_normal_criteria_cells as
select
  submission_id,
  criteria_id,
  criteria_name,
  avg(weighted_score) as avg_score,
  jsonb_agg(
    jsonb_build_object(
      'user_id', user_id,
      'user_name', user_name,
      'grade', grade,
      'weighted_score', weighted_score
    )
    order by user_id
  ) as graders
from submission_criteria_user_grades
group by submission_id, criteria_id, criteria_name;

-- =========================================================
-- 3. Tổng điểm (đã nhân trọng số) của từng user theo submission
-- =========================================================
CREATE OR REPLACE view submission_user_final_points as
select
  submission_id,
  user_id,
  user_name,
  sum(weighted_score) as user_total
from submission_criteria_user_grades
group by submission_id, user_id, user_name;

-- =========================================================
-- 4. Final cell: avg của user_total
-- =========================================================
CREATE OR REPLACE view submission_final_cell as
select
  submission_id,
  avg(user_total) as final_avg_score
from submission_user_final_points
group by submission_id;

-- =========================================================
-- 5. Breakdown từng user theo SPECIFIC criteria (type <> 'normal')
-- =========================================================
CREATE OR REPLACE view submission_specific_criteria_user_grades as
select
  sg.submission_id,
  c.id as criteria_id,
  c.criteria_name,
  c.percentage,
  sg.user_id,
  p.full_name as user_name,
  sg.grade,
  sg.grade * (c.percentage / 100.0) as weighted_score
from submission_grading sg
join event_grading_criteria c on sg.event_criteria_id = c.id
join profiles p on p.id = sg.user_id
where c.type <> 'normal';

-- =========================================================
-- 6. Gộp cell (avg_score + graders) theo từng SPECIFIC criteria
-- =========================================================
CREATE OR REPLACE view submission_specific_criteria_cells as
select
  submission_id,
  criteria_id,
  criteria_name,
  avg(weighted_score) as avg_score,
  jsonb_agg(
    jsonb_build_object(
      'user_id', user_id,
      'user_name', user_name,
      'grade', grade,
      'weighted_score', weighted_score
    )
    order by user_id
  ) as graders
from submission_specific_criteria_user_grades
group by submission_id, criteria_id, criteria_name;

-- =========================================================
-- 7. View tổng: mỗi submission 1 dòng, kèm event_id để filter
-- =========================================================
CREATE OR REPLACE view submission_final_scores as
select
  s.id as submission_id,
  g.id as group_id,
  g.group_name,
  g.event_id,
  fc.final_avg_score,
  coalesce(
    (select jsonb_agg(jsonb_build_object(
       'criteria_id', criteria_id,
       'criteria_name', criteria_name,
       'avg_score', avg_score,
       'graders', graders
     ) order by criteria_id)
     from submission_normal_criteria_cells nc
     where nc.submission_id = s.id),
    '[]'::jsonb
  ) as normal_criteria,
  coalesce(
    (select jsonb_agg(jsonb_build_object(
       'criteria_id', criteria_id,
       'criteria_name', criteria_name,
       'avg_score', avg_score,
       'graders', graders
     ) order by criteria_id)
     from submission_specific_criteria_cells sc
     where sc.submission_id = s.id),
    '[]'::jsonb
  ) as specific_criteria,
  rc.avg_rating,
  rc.total_raters,
  coalesce(rc.raters, '[]'::jsonb) as raters,
  s.title as submission_title
from submissions s
join groups g on g.id = s.group_id
left join submission_final_cell fc on fc.submission_id = s.id
left join submission_ratings_cell rc on rc.submission_id = s.id;