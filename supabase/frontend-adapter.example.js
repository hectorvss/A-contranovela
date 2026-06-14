// Example adapter for the next migration step.
// Requires Supabase JS v2 in the page:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchEditorialData() {
  const [
    { data: categories, error: categoriesError },
    { data: reviews, error: reviewsError },
    { data: pages, error: pagesError },
  ] = await Promise.all([
    db.from("categories").select("*").order("sort_order"),
    db.from("reviews").select("*").eq("is_published", true).order("sort_order"),
    db.from("editorial_pages").select("*"),
  ]);

  if (categoriesError) throw categoriesError;
  if (reviewsError) throw reviewsError;
  if (pagesError) throw pagesError;

  return {
    categories,
    pages: Object.fromEntries(pages.map((page) => [page.id, page])),
    reviews: reviews.map(fromSupabaseReview),
  };
}

export async function saveReview(review) {
  const payload = toSupabaseReview(review);
  const { data, error } = await db.from("reviews").upsert(payload).select().single();
  if (error) throw error;
  return fromSupabaseReview(data);
}

export async function deleteReview(id) {
  const { error } = await db.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

export async function saveEditorialPage(id, title, content) {
  const { data, error } = await db
    .from("editorial_pages")
    .upsert({ id, title, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadCover(file, reviewId) {
  const extension = file.type === "image/png" ? "png" : "jpg";
  const path = `${reviewId}/${Date.now()}.${extension}`;
  const { error } = await db.storage.from("covers").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw error;
  return db.storage.from("covers").getPublicUrl(path).data.publicUrl;
}

function fromSupabaseReview(row) {
  return {
    id: row.id,
    section: row.section,
    author: row.author,
    title: row.title,
    subtitle: row.subtitle || "",
    summary: row.summary,
    score: row.score?.toString() || "",
    publisher: row.publisher || "",
    year: row.publication_year || "",
    translator: row.translator || "",
    pages: row.pages || "",
    image: row.cover_image_url,
    tone: row.cover_tone || "#efe7d8",
    coverFilter: row.cover_filter,
    slot: row.slot || "",
    body: row.body || [],
    images: row.images || [],
  };
}

function toSupabaseReview(review) {
  return {
    id: review.id,
    section: review.section,
    author: review.author,
    title: review.title,
    subtitle: review.subtitle || null,
    summary: review.summary,
    score: review.score ? Number(review.score) : null,
    publisher: review.publisher || null,
    publication_year: review.year || null,
    translator: review.translator || null,
    pages: review.pages || null,
    cover_image_url: review.image,
    cover_tone: review.tone || "#efe7d8",
    cover_filter: review.coverFilter || "grayscale(1) contrast(1.05)",
    slot: review.slot || "",
    body: review.body || [],
    images: review.images || [],
    is_published: true,
  };
}
