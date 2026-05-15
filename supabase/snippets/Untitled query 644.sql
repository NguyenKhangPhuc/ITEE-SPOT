create table public.project_files (
  id uuid not null default gen_random_uuid (),
  project_id uuid null,
  storage_path text null,
  original_file_name text null,
  mime_type text null,
  size bigint null,
  created_at timestamp with time zone not null default now(),
  constraint project_files_pkey primary key (id),
  constraint project_files_project_id_fkey foreign KEY (project_id) references projects (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;