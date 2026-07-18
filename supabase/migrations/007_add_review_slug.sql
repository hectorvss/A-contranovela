alter table public.reviews add column if not exists slug text;

create unique index if not exists reviews_slug_idx
  on public.reviews (slug)
  where slug is not null and slug <> '';
