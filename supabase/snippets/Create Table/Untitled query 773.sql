create table public.project_awards (
  id uuid not null default gen_random_uuid (),
  project_id uuid null,
  award_id uuid null,
  created_at timestamp with time zone not null default now(),
  constraint project_awards_pkey primary key (id),
  constraint project_awards_project_id_fkey foreign KEY (project_id) references projects (id) on update CASCADE on delete CASCADE,
  constraint project_awards_award_id_fkey foreign KEY (award_id) references event_awards (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;
