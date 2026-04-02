"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getReviewByMovieId(movieId: number | string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("movie_id", Number(movieId))
    .eq("user_id", userData.user.id)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data || null;
}

export async function saveReview(reviewData: { id?: string, movie_id: number, movie_title: string, poster_path?: string, rating: number, review_text: string }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Unauthorized. Only the owner can review movies.");

  if (reviewData.id) {
    const { error } = await supabase.from("reviews").update({
      rating: reviewData.rating,
      review_text: reviewData.review_text
    }).eq("id", reviewData.id).eq("user_id", userData.user.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("reviews").insert({
      user_id: userData.user.id,
      movie_id: Number(reviewData.movie_id),
      movie_title: reviewData.movie_title,
      poster_path: reviewData.poster_path,
      rating: reviewData.rating,
      review_text: reviewData.review_text
    });
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/my-movies");
  revalidatePath(`/movie/${reviewData.movie_id}`);
  return true;
}

export async function deleteReview(id: string, movieId?: number) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) throw new Error(error.message);
  
  revalidatePath("/my-movies");
  if (movieId) revalidatePath(`/movie/${movieId}`);
  return true;
}
