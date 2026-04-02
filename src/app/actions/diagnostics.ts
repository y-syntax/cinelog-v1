"use server";
import { createClient } from "@/utils/supabase/server";

export async function checkDuplicates() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return "Not logged in";

  const { data, error } = await supabase
    .from("reviews")
    .select("movie_id, count(*)")
    .eq("user_id", userData.user.id)
    .csv(); // Grouping in Supabase JS is tricky, let's just get all and check manually

  const { data: allReviews } = await supabase
    .from("reviews")
    .select("movie_id, id")
    .eq("user_id", userData.user.id);
  
  if (!allReviews) return "No reviews found";

  const counts: Record<number, string[]> = {};
  const duplicates: number[] = [];

  allReviews.forEach(r => {
    if (!counts[r.movie_id]) counts[r.movie_id] = [];
    counts[r.movie_id].push(r.id);
    if (counts[r.movie_id].length > 1 && !duplicates.includes(r.movie_id)) {
      duplicates.push(r.movie_id);
    }
  });

  return { 
    total: allReviews.length, 
    duplicates: duplicates.length,
    duplicateMovieIds: duplicates,
    details: duplicates.map(id => ({ movieId: id, ids: counts[id] }))
  };
}

export async function cleanupDuplicates() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return "Not logged in";

  const diag = await checkDuplicates();
  if (typeof diag === 'string') return diag;
  
  for (const item of diag.details) {
    // Keep the first one, delete the rest
    const idsToDelete = item.ids.slice(1);
    await supabase.from("reviews").delete().in("id", idsToDelete);
  }

  return "Cleanup complete";
}
