"use client";
import { useState } from 'react';
import { saveReview, deleteReview } from '@/app/actions/dbActions';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ movieId, movieTitle, posterPath, existingReview }) {
  const [rating, setRating] = useState(existingReview?.rating || 10);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await saveReview({
        id: existingReview?.id,
        movie_id: Number(movieId),
        movie_title: movieTitle,
        poster_path: posterPath,
        rating: Number(rating),
        review_text: reviewText
      });
      router.refresh();
      router.push('/my-movies');
    } catch (err) {
      setError(err.message || 'Failed to save review. Ensure you are authorized.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview?.id) return;
    if (!confirm('Are you sure you want to delete this review?')) return;
    setLoading(true);
    try {
      await deleteReview(existingReview.id, Number(movieId));
      router.refresh();
      router.push('/my-movies');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 bg-slate-900/50 p-5 md:p-8 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />
      
      <div className="relative z-10 space-y-6">
        {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-xl text-sm border border-red-500/20">{error}</div>}
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Your Rating (1-10)</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full max-w-xs accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-3xl font-black text-white w-16 text-center">{Number(rating).toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Your Review</label>
          <textarea 
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={5}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 md:p-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-slate-600 transition-all resize-none text-base"
            placeholder={`What did you think of ${movieTitle}?`}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-white rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25"
          >
            {loading ? 'Saving...' : (existingReview ? 'Update Journal' : 'Save to Journal')}
          </button>

          {existingReview && (
            <button 
              type="button" 
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl transition-all disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
