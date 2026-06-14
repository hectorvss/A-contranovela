-- Repair UTF-8 text that was previously stored/displayed as Latin-1 mojibake.
-- Safe to run more than once: once repaired, the replacements no longer match.

create or replace function public.repair_mojibake_text(input text)
returns text
language plpgsql
immutable
as $$
declare
  result text := coalesce(input, '');
begin
  result := replace(result, chr(195) || chr(161), 'á');
  result := replace(result, chr(195) || chr(169), 'é');
  result := replace(result, chr(195) || chr(173), 'í');
  result := replace(result, chr(195) || chr(179), 'ó');
  result := replace(result, chr(195) || chr(186), 'ú');
  result := replace(result, chr(195) || chr(129), 'Á');
  result := replace(result, chr(195) || chr(137), 'É');
  result := replace(result, chr(195) || chr(141), 'Í');
  result := replace(result, chr(195) || chr(147), 'Ó');
  result := replace(result, chr(195) || chr(154), 'Ú');
  result := replace(result, chr(195) || chr(177), 'ñ');
  result := replace(result, chr(195) || chr(145), 'Ñ');
  result := replace(result, chr(195) || chr(8216), 'Ñ');
  result := replace(result, chr(194) || chr(191), '¿');
  result := replace(result, chr(194) || chr(161), '¡');
  result := replace(result, chr(194) || chr(183), '·');
  result := replace(result, chr(194) || chr(186), 'º');
  result := replace(result, chr(194) || chr(170), 'ª');
  result := replace(result, chr(195) || chr(151), '×');
  result := replace(result, chr(226) || chr(134) || chr(144), '←');
  result := replace(result, chr(226) || chr(134) || chr(145), '↑');
  result := replace(result, chr(226) || chr(134) || chr(146), '→');
  result := replace(result, chr(226) || chr(134) || chr(147), '↓');
  result := replace(result, chr(226) || chr(134) || chr(149), '↕');
  result := replace(result, chr(226) || chr(128) || chr(147), '–');
  result := replace(result, chr(226) || chr(128) || chr(148), '—');
  result := replace(result, chr(226) || chr(128) || chr(156), '“');
  result := replace(result, chr(226) || chr(128) || chr(157), '”');
  result := replace(result, chr(226) || chr(128) || chr(152), '‘');
  result := replace(result, chr(226) || chr(128) || chr(153), '’');
  return result;
end;
$$;

update public.categories
set label = public.repair_mojibake_text(label);

update public.cover_filters
set label = public.repair_mojibake_text(label),
    value = public.repair_mojibake_text(value);

update public.reviews
set author = public.repair_mojibake_text(author),
    title = public.repair_mojibake_text(title),
    subtitle = nullif(public.repair_mojibake_text(coalesce(subtitle, '')), ''),
    summary = public.repair_mojibake_text(summary),
    publisher = nullif(public.repair_mojibake_text(coalesce(publisher, '')), ''),
    translator = nullif(public.repair_mojibake_text(coalesce(translator, '')), ''),
    pages = nullif(public.repair_mojibake_text(coalesce(pages, '')), ''),
    slot = nullif(public.repair_mojibake_text(coalesce(slot, '')), ''),
    body = public.repair_mojibake_text(body::text)::jsonb,
    images = public.repair_mojibake_text(images::text)::jsonb;

update public.editorial_pages
set content = public.repair_mojibake_text(content::text)::jsonb;

drop function public.repair_mojibake_text(text);
