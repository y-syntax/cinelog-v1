import { getCommunityReviews } from "@/app/actions/dbActions";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import CommunityFilters from "@/components/CommunityFilters";
import { formatDate } from "@/utils/dateFormatter";

export const metadata = {
  title: "Community Reviews | CineLog",
  description: "See what other cinephiles are watching and reviewing.",
};

export const dynamic = 'force-dynamic';

export default async function CommunityPage({ searchParams }) {
  const params = await searchParams;
  const sortBy = params?.sort || 'latest';
  const minRating = params?.min ? Number(params.min) : undefined;
  const genreId = params?.genre ? Number(params.genre) : undefined;

  const reviews = await getCommunityReviews({ sortBy, minRating, genreId });

  return (
    <div className="min-h-screen bg-cinema-dark text-slate-100 pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-2">
            Community <span className="text-cinema-red">Reviews</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg font-medium">
            Discover your next favorite movie through the eyes of fellow film nerds.
          </p>
        </header>

        <CommunityFilters />

        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-cinema-surface/50 rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="text-4xl mb-4">🎬</div>
            <p className="text-slate-400 font-medium text-lg">No reviews found for these filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="group relative bg-cinema-surface border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col h-full shadow-lg"
              >
                {/* Movie Header */}
                <div className="flex gap-4 p-4 border-b border-white/5 bg-black/20">
                  <div className="relative w-16 h-24 flex-shrink-0 bg-black/40 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-cinema-red/50 transition-all duration-500">
                    {review.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${review.poster_path}`}
                        alt={review.movie_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/movie/${review.movie_id}`}
                      className="text-lg font-heading font-bold text-white hover:text-cinema-red transition-colors leading-tight line-clamp-2"
                    >
                      {review.movie_title}
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-cinema-red/10 text-cinema-red px-2 py-0.5 rounded text-xs font-black ring-1 ring-cinema-red/20 shadow-lg shadow-cinema-red/10">
                        {Number(review.rating).toFixed(1)}/10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cinema-red to-red-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg shadow-cinema-red/20">
                      {review.reviewer_name[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-300 truncate uppercase tracking-widest">
                      {review.reviewer_name}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto font-medium">
                      {formatDate(review.created_at)}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-6 mb-6 italic border-l-2 border-white/10 pl-3">
                    "{review.review_text}"
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <LikeButton reviewId={review.id} initialLikes={review.likes_count} />
                    <Link 
                      href={`/movie/${review.movie_id}`}
                      className="text-[10px] font-black tracking-widest text-slate-400 hover:text-white uppercase transition-colors"
                    >
                      View Movie
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
