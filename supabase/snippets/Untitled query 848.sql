-- Xóa trigger cũ (nếu có)
drop trigger if exists trigger_delete_file_on_storage on public.submission_file;

-- Xóa function cũ
drop function if exists delete_storage_file() cascade;