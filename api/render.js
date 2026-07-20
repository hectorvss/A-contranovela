const SUPABASE_URL = "https://kqzsiydffnuixwgyaups.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxenNpeWRmZm51aXh3Z3lhdXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MzUxMzQsImV4cCI6MjA5NzAxMTEzNH0.3VZwuHHhZBFjvqmDJgVzp5ZTPOzw5c0Y6FntOai_0Bc";

const RESERVED = new Set(["textos", "flash", "escala", "hoy-manana", "no", "yo"]);

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function fetchReview(slug) {
  const filter = `or=(slug.eq.${encodeURIComponent(slug)},id.eq.${encodeURIComponent(slug)})`;
  const url = `${SUPABASE_URL}/rest/v1/reviews?${filter}&is_published=eq.true&select=title,author,summary,cover_image_url&limit=1`;
  const response = await fetch(url, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!response.ok) return null;
  const rows = await response.json();
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

module.exports = async (req, res) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const origin = `${protocol}://${host}`;
  const slug = decodeURIComponent(String(req.query.slug || "")).replace(/^\/+|\/+$/g, "");

  let html;
  try {
    const indexRes = await fetch(`${origin}/index.html`);
    html = await indexRes.text();
  } catch (error) {
    res.status(502).send("Bad gateway");
    return;
  }

  if (slug && !RESERVED.has(slug)) {
    try {
      const review = await fetchReview(slug);
      if (review) {
        const ogTitle = escapeHtml(`${review.title} — ${review.author}`);
        const ogDescription = escapeHtml(review.summary || "Reseñas y notas de lectura.");
        const ogImage = escapeHtml(review.cover_image_url || "");
        const ogUrl = escapeHtml(`${origin}/${slug}`);
        html = html.replace(/<title>.*?<\/title>/, `<title>${ogTitle}</title>`);
        html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${ogDescription}" />`);
        html = html.replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="article" />`);
        html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${ogTitle}" />`);
        html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${ogDescription}" />`);
        if (ogImage) {
          html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${ogImage}" />`);
          html = html.replace(/\s*<meta property="og:image:width" content=".*?" \/>/, "");
          html = html.replace(/\s*<meta property="og:image:height" content=".*?" \/>/, "");
        }
        html = html.replace(/<meta name="twitter:card" content=".*?" \/>/, `<meta name="twitter:card" content="summary_large_image" />`);
        html = html.replace("</head>", `    <meta property="og:url" content="${ogUrl}" />\n  </head>`);
      }
    } catch (error) {
      console.error("OG render failed for", slug, error);
    }
  }

  res.setHeader("content-type", "text/html; charset=utf-8");
  res.setHeader("cache-control", "public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
  res.status(200).send(html);
};
