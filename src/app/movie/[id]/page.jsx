import { getMovieDetails } from '@/app/actions/movieApi';
import { getReviewByMovieId, getAllReviewsForMovie } from '@/app/actions/dbActions';
import ReviewsSection from './ReviewsSection';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const movie = await getMovieDetails(id);
    console.log(`[SEO] generateMetadata executed for movie: ${movie.title} (ID: ${id})`);
    return {
      title: movie.title,
      description: movie.overview || `Review and track ${movie.title} on CineLog.`,
    };
  } catch (err) {
    console.error("generateMetadata error:", err);
    return {
      title: "Movie",
    };
  }
}

export default async function MoviePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  let movie, existingReview, allReviews = [];
  
  try {
    movie = await getMovieDetails(id);
    existingReview = await getReviewByMovieId(id);
    allReviews = await getAllReviewsForMovie(id);
  } catch (err) {
    console.error("MoviePage data fetch error:", err);
    if (!movie) throw err; 
  }

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`
    : null;

  return (
    <div className="fade-in pb-20 md:pb-24">
      {/* Hero Backdrop */}
      {posterUrl && (
        <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[70vh] -z-10">
          <div className="absolute inset-0 bg-slate-900/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
          <img 
            src={posterUrl} 
            alt="Backdrop" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-12 md:mt-24 flex flex-col md:flex-row gap-8 md:gap-16 px-4 md:px-8">
        {/* Poster */}
        <div className="w-full md:w-[350px] flex-shrink-0 flex justify-center md:block">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
              alt={movie.title}
              className="relative w-[80%] md:w-full rounded-[2rem] shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:flex-1 space-y-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-4 items-center text-sm md:text-base font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full border border-indigo-500/20">
                  <span className="text-yellow-500">⭐</span> {movie.vote_average?.toFixed(1)} <span className="text-xs opacity-50">TMDB</span>
                </span>
                <span>{movie.release_date?.split('-')[0]}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <span>{movie.runtime} min</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map(g => (
                <span key={g.id} className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl text-sm font-medium text-slate-300">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="space-y-4 max-w-3xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">The Story</h3>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light italic">
                "{movie.overview}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
        <div className="pt-16 border-t border-white/5">
          {movie ? (
            <ReviewsSection 
              reviews={allReviews}
              existingReview={existingReview}
              movieId={movie.id}
              movieTitle={movie.title}
              posterPath={movie.poster_path}
              genreIds={movie.genres?.map(g => g.id)}
              isLoggedIn={isLoggedIn}
            />
          ) : (
            <div className="bg-red-500/10 p-8 rounded-[2rem] border border-red-500/20 text-red-400 text-center">
              <p className="text-lg font-bold">Unable to load discussion community.</p>
              <button onClick={() => window.location.reload()} className="mt-4 underline">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
