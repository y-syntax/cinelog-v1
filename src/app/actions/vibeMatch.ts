"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getReviews } from "./dbActions";
import { searchMovies } from "./movieApi";
import { getExclusions } from "./userExclusions";

export async function getVibeMatch() {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) throw new Error("Missing Gemini API Key in environment");
  
  const genAI = new GoogleGenerativeAI(API_KEY);

  const [reviews, exclusions] = await Promise.all([
    getReviews(),
    getExclusions()
  ]);

  if (!reviews || reviews.length === 0) {
    return { error: "No reviews found. Add some reviews so we can detect your vibe!" };
  }

  // Extract recent highly-rated movies to form a prompt
  const recentFavorites = reviews
    .filter((r) => r.rating >= 7)
    .slice(0, 15)
    .map((r) => r.movie_title)
    .join(", ");

  if (!recentFavorites) {
    return { error: "You don't have enough highly-rated movies yet to find a vibe match." }
  }

  const prompt = `Based on my favorite movies: ${recentFavorites}. 
  Suggest EXACTLY THREE highly recommended movies I haven't seen that have a similar "vibe". 
  Focus on a mix of "all-time classics" and "unexpected surprises" across any language or era.
  
  Format your response as a valid JSON array of objects: 
  [{"title": "Movie Title", "reasoning": "A short 1-sentence reason why it matches my vibe"}]
  
  ${exclusions.length > 0 ? `Do not include these movie IDs (I'm not interested): ${exclusions.join(", ")}.` : ""}
  Only output the JSON array and nothing else.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(text);

    // Fetch TMDB data for each suggestion
    const matches = await Promise.all(
      suggestions.map(async (s: any) => {
        const searchResults = await searchMovies(s.title);
        if (searchResults && searchResults.length > 0) {
          return { ...searchResults[0], reasoning: s.reasoning };
        }
        return null;
      })
    );

    return { matches: matches.filter(m => m !== null) };
  } catch (error: any) {
    console.error("Vibe Match AI Error:", error);
    return { error: "Failed to generate your vibe match. Try again later." };
  }
}
