set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.protect_profile_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE TRIGGER enforce_profile_role_protection BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();


