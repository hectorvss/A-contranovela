insert into public.cover_filters (label, css_filter, sort_order) values
  ('Editorial cream #EAE4D8', 'grayscale(.82) sepia(.18) saturate(.85) brightness(1.06) contrast(.96)', 21),
  ('Dusty rose #D0C8C5', 'grayscale(.68) sepia(.2) saturate(.72) hue-rotate(320deg) brightness(1.02) contrast(.96)', 22),
  ('Nordic grey blue #B8C1CB', 'grayscale(.72) sepia(.08) saturate(.9) hue-rotate(170deg) brightness(1.03) contrast(.98)', 23),
  ('Muted forest #4B5A4E', 'grayscale(.58) sepia(.2) saturate(.85) hue-rotate(70deg) brightness(.72) contrast(1.08)', 24),
  ('Editorial black #181818', 'grayscale(1) brightness(.48) contrast(1.38)', 25)
on conflict (label) do update set
  css_filter = excluded.css_filter,
  sort_order = excluded.sort_order;
