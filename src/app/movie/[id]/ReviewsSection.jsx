"use client";
import { useState } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewsSection({ reviews, existingReview, movieId, movieTitle, posterPath, genreIds, isLoggedIn }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  // Filter out the current user's review from the general list if it exists
  const otherReviews = existingReview 
    ? reviews.filter(r => r.id !== existingReview.id)
    : reviews;

  const displayedReviews = showAll ? otherReviews : otherReviews.slice(0, 3);

  const handleSuccess = () => {
    setIsFormOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-12">
      {/* Header & Main Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Community <span className="text-indigo-500">Voices</span>
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Detailed reviews and ratings from members.</p>
        </div>
        
        {!isFormOpen && (
          isLoggedIn ? (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group cursor-pointer"
            >
              {existingReview ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Update Your Review
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Your Review
                </>
              )}
            </button>
          ) : (
            <Link 
              href="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Login to Add Review
            </Link>
          )
        )}
      </div>

      {/* Review Form (Popping up in a section) */}
      {isFormOpen && (
        <div className="fade-in animate-in slide-in-from-top-4 duration-500 pb-8">
          <ReviewForm 
            movieId={movieId}
            movieTitle={movieTitle}
            posterPath={posterPath}
            genreIds={genreIds}
            existingReview={existingReview}
            onCancel={() => setIsFormOpen(false)}
            onSuccess={handleSuccess}
          />
        </div>
      )}

      {/* Reviews Display */}
      <div className="space-y-12">
        {/* Your Review Card */}
        {existingReview && !isFormOpen && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-8 bg-indigo-500/50"></div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">Your Perspective</h3>
            </div>
            <ReviewCard review={existingReview} isCurrentUser={true} />
          </div>
        )}

        {/* Other People's Reviews */}
        <div className="space-y-6">
          {otherReviews.length > 0 && (
            <div className="flex items-center gap-3 mb-8">
              <div className="h-0.5 w-8 bg-slate-700"></div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Community Members</h3>
            </div>
          )}
          
          {otherReviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {displayedReviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              
              {otherReviews.length > 3 && (
                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setShowAll(!showAll)}
                    className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all backdrop-blur-sm active:scale-95"
                  >
                    {showAll ? 'Show Less' : `View All ${otherReviews.length} Reviews`}
                  </button>
                </div>
              )}
            </>
          ) : (
            !existingReview && !isFormOpen && (
              <div className="py-24 text-center bg-slate-900/40 rounded-[2.5rem] border border-dashed border-white/5 backdrop-blur-sm">
                <div className="mb-4 text-4xl">🎬</div>
                <p className="text-slate-400 text-xl font-medium">No reviews yet. Be the first to start the conversation!</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
