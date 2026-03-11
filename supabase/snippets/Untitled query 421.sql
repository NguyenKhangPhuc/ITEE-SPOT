create or replace function delete_storage_file()
returns trigger as $$
begin
  -- Xóa file vật lý trong storage.objects
  -- old.storage_path phải khớp chính xác với tên cột trong bảng của bạn
  delete from storage.objects 
  where bucket_id = 'attachments' 
  and name = old.storage_path;
  
  return old;
end;
$$ language plpgsql security definer;

-- Tạo lại trigger
create trigger trigger_delete_file_on_storage
after delete on public.submission_files -- Kiểm tra lại tên bảng có 's' hay không!
for each row execute function delete_storage_file();