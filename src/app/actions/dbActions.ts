"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return [];

    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    
    // Map data to include the name more easily
    return data.map(r => ({
      ...r,
      reviewer_name: r.profiles?.full_name || 'Anonymous'
    }));
  } catch (err) {
    console.error("getReviews error:", err);
    return [];
  }
}

export async function getReviewByMovieId(movieId: number | string) {
  try {
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
  } catch (err) {
    console.error("getReviewByMovieId error:", err);
    return null;
  }
}

export async function saveReview(reviewData: { id?: string, movie_id: number, movie_title: string, poster_path?: string, rating: number, review_text: string }) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { success: false, error: "Unauthorized. Please Login." };

    // Check if user is approved
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_approved, is_admin')
      .eq('id', userData.user.id)
      .single();

    if (!profile?.is_approved && !profile?.is_admin) {
      return { success: false, error: "Your account is awaiting admin approval." };
    }

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
    return { success: true };
  } catch (err) {
    console.error("saveReview error:", err);
    return { success: false, error: err.message || "Failed to save review." };
  }
}

export async function deleteReview(id: string, movieId?: number) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", userData.user.id);

    if (error) throw new Error(error.message);
    
    revalidatePath("/my-movies");
    if (movieId) revalidatePath(`/movie/${movieId}`);
    return { success: true };
  } catch (err) {
    console.error("deleteReview error:", err);
    return { success: false, error: err.message || "Failed to delete review." };
  }
}
