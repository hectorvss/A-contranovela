begin;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text not null default 'es',
  source text not null default 'popup',
  subscribed_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_unique
  on public.newsletter_subscribers (email);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public insert newsletter subscribers" on public.newsletter_subscribers;
create policy "Public insert newsletter subscribers" on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Managers read newsletter subscribers" on public.newsletter_subscribers;
create policy "Managers read newsletter subscribers" on public.newsletter_subscribers
  for select
  to authenticated
  using (exists (select 1 from public.manager_users where user_id = auth.uid()));

commit;
