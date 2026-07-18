create or replace function protect_profile_role()
returns trigger as $$
begin
  -- Kiểm tra xem cột role có bị thay đổi hay không
  if NEW.role IS DISTINCT FROM OLD.role then
    -- Nếu cột role bị đổi, kiểm tra xem người thực hiện (auth.uid()) có phải là admin cũ không
    if not exists (
      select 1 from profiles 
      where id =   (select auth.uid()) and role = 'admin'::"PROFILE_ROLE"
    ) then
      -- Nếu không phải admin, chặn đứng hành vi hack role
      raise exception 'Bạn không được phép tự thay đổi Role của mình!';
    end if;
  end if;
  
  return NEW;
end;
$$ language plpgsql security definer;

-- Gắn trigger vào bảng profiles
create trigger enforce_profile_role_protection
before update on profiles
for each row
execute function protect_profile_role();