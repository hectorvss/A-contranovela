-- Restrict editorial writes to explicitly approved manager users.

begin;

create table if not exists public.manager_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.manager_users enable row level security;

drop policy if exists "Managers can read manager users" on public.manager_users;
create policy "Managers can read manager users" on public.manager_users
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Authenticated manage categories" on public.categories;
drop policy if exists "Authenticated manage cover filters" on public.cover_filters;
drop policy if exists "Authenticated manage editorial pages" on public.editorial_pages;
drop policy if exists "Authenticated manage reviews" on public.reviews;
drop policy if exists "Authenticated manage cover files" on storage.objects;

create policy "Managers manage categories" on public.categories
  for all to authenticated
  using (exists (select 1 from public.manager_users where user_id = auth.uid()))
  with check (exists (select 1 from public.manager_users where user_id = auth.uid()));

create policy "Managers manage cover filters" on public.cover_filters
  for all to authenticated
  using (exists (select 1 from public.manager_users where user_id = auth.uid()))
  with check (exists (select 1 from public.manager_users where user_id = auth.uid()));

create policy "Managers manage editorial pages" on public.editorial_pages
  for all to authenticated
  using (exists (select 1 from public.manager_users where user_id = auth.uid()))
  with check (exists (select 1 from public.manager_users where user_id = auth.uid()));

create policy "Managers manage reviews" on public.reviews
  for all to authenticated
  using (exists (select 1 from public.manager_users where user_id = auth.uid()))
  with check (exists (select 1 from public.manager_users where user_id = auth.uid()));

create policy "Managers manage cover files" on storage.objects
  for all to authenticated
  using (
    bucket_id in ('covers', 'article-images')
    and exists (select 1 from public.manager_users where user_id = auth.uid())
  )
  with check (
    bucket_id in ('covers', 'article-images')
    and exists (select 1 from public.manager_users where user_id = auth.uid())
  );

commit;
