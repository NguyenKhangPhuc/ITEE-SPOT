update public.profiles
set email = lower(email)
where email is not null;
