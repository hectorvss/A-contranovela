-- Run this after creating the manager user in Supabase Auth.
-- Replace both placeholders before executing.

insert into public.manager_users (user_id, email)
values ('AUTH_USER_ID_HERE', 'manager@example.com')
on conflict (user_id) do update set email = excluded.email;
