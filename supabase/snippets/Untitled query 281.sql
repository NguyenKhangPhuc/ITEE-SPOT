create or replace view projects_with_priority as
select 
  p.*,
  (
    select min(ea.award_priority)
    from projects_awards pa
    join event_awards ea on award_id = ea.id
    where pa.project_id = p.id
  ) as top_priority
from projects p;