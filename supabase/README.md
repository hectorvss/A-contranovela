# Supabase migration prep

This folder prepares the project for moving all editorial content out of the static HTML/JS seed and into Supabase.

## Files

- `migrations/001_initial_schema_and_seed.sql`
  - Creates the editorial schema.
  - Creates categories, cover filters, editorial pages, reviews and storage buckets.
  - Seeds the current local content: all textos, flash, escala, hoy/manana and no reviews.
- `migrations/002_secure_manager_access.sql`
  - Restricts all editorial writes to explicitly approved manager users.
  - Replaces broad authenticated write policies with `public.manager_users` checks.
- `migrations/003_repair_text_encoding.sql`
  - Repairs mojibake text such as `MAÃ‘ANA`, `allÃ­`, broken arrows and Spanish accents in seeded/editorial data.
- `migrations/004_add_editorial_cover_filters.sql`
  - Adds the editorial color-inspired cover filters: cream, dusty rose, nordic grey blue, muted forest and editorial black.
- `seed/reviews.json`
  - JSON export generated from the current local seed content.
  - Useful for audits, scripts or import tooling.

## Tables

- `categories`
  - Main sections: textos, flash, escala, hoy-manana, no.
- `cover_filters`
  - The 20 cover filters available in the manager.
- `editorial_pages`
  - Editable non-review pages, starting with the `YO` autobiography in Spanish and English.
- `reviews`
  - Every essay/review with title, subtitle, summary, score, metadata, cover, filter, body blocks and images.
- `manager_users`
  - Auth users allowed to create, edit, delete and upload editorial content.

## Storage

The migration creates two public buckets:

- `covers`
  - For uploaded book covers.
- `article-images`
  - Reserved for article images if needed later.

Both buckets accept `image/png` and `image/jpeg`.

## How to run once the Supabase project exists

1. Open the Supabase SQL editor.
2. Paste and run `migrations/001_initial_schema_and_seed.sql`.
3. Paste and run `migrations/002_secure_manager_access.sql`.
4. Paste and run `migrations/003_repair_text_encoding.sql` if any accent appears broken after seed/import.
5. Paste and run `migrations/004_add_editorial_cover_filters.sql`.
6. Create the manager user in Supabase Auth.
7. Insert the manager user into `public.manager_users`.
8. Fill `supabase-config.js`.
3. Confirm the resulting counts:

```sql
select count(*) from public.categories;
select count(*) from public.cover_filters;
select count(*) from public.editorial_pages;
select count(*) from public.manager_users;
select count(*) from public.reviews;
```

Expected initial counts:

- `categories`: 5
- `cover_filters`: 25 after running `004_add_editorial_cover_filters.sql`
- `editorial_pages`: 1
- `manager_users`: 1 after you add the manager user manually
- `reviews`: 31

## Frontend migration notes

The frontend now includes a Supabase bridge. Fill `supabase-config.js` before deploying:

```js
window.ACONTRANOVELA_SUPABASE = {
  url: "https://YOUR_PROJECT.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_KEY",
  managerEmail: "manager@example.com",
};
```

Create a Supabase Auth user for the manager:

- Email: the same value used in `managerEmail`.
- Password: choose the password the manager will type in the popup. For local fallback only, `LMF39` still opens the panel before Supabase is configured.

After creating the Auth user, copy its `id` and run:

```sql
insert into public.manager_users (user_id, email)
values ('AUTH_USER_ID_HERE', 'manager@example.com')
on conflict (user_id) do update set email = excluded.email;
```

The manager popup password is used to sign in with Supabase Auth. This keeps the anon key public while writes still use the manager-only RLS policies.

The app now uses:

- `select` from `reviews` and `categories` for public rendering.
- `select` from `editorial_pages` for `YO`.
- authenticated `insert`, `update`, `delete` on `reviews` and `editorial_pages` from the manager.
- upload cover files to the `covers` bucket and store the public URL in `reviews.cover_image_url`.

If `supabase-config.js` is empty, the app continues using the local seed and `localStorage` fallback.
