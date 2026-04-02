import { searchMovies, getDiscoveryMovies } from '@/app/actions/movieApi';
import { getVibeMatch } from '@/app/actions/vibeMatch';
import MovieCard from '@/components/MovieCard';
import AutoScroller from '@/components/AutoScroller';
import { getExclusions } from '@/app/actions/userExclusions';
import { getReviews } from '@/app/actions/dbActions';
import { cleanupDuplicates } from '@/app/actions/diagnostics';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || '';

  // One-time cleanup for duplicate reviews (Safe to run multiple times, but needed once)
  await cleanupDuplicates().catch(err => console.error("Cleanup error:", err));
  
  // Fetch discovery movies, exclusions, and reviews in parallel
  const [initialDiscovery, exclusions, reviews] = await Promise.all([
    getDiscoveryMovies().catch(() => []),
    getExclusions().catch(() => []),
    getReviews().catch(() => [])
  ]);

  // Filter out movies that are either excluded or already reviewed
  const reviewedIds = reviews.map(r => Number(r.movie_id));
  const excludedIds = exclusions.map(id => Number(id));
  
  const discoveryMovies = initialDiscovery.filter(movie => 
    !excludedIds.includes(Number(movie.id)) && 
    !reviewedIds.includes(Number(movie.id))
  );

  let searchResults = [];
  let vibeMatches = [];
  
  if (query) {
    [searchResults, vibeMatches] = await Promise.all([
      searchMovies(query).catch(() => []),
      getVibeMatch().catch(() => ({ matches: [] }))
    ]);
  }

  const recommendations = vibeMatches?.matches || [];

  return (
    <div className="space-y-16 py-10 md:py-20 fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-10 z-10 px-4 relative">
        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none">
          Cine<span className="gradient-text">Log</span>
        </h1>
        <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto px-4">
          Documentation of my personal cinematic journey. Discover gems, log reviews, and curate your vibe.
        </p>
      </div>

      {/* Discovery Section (Visual Marquee) */}
      <div className="space-y-4">
        <div className="px-6 relative z-10">
          <h2 className="text-2xl font-bold text-slate-300 tracking-wider uppercase text-xs">Random <span className="text-indigo-400 font-black">Discoveries</span></h2>
        </div>
        <AutoScroller movies={discoveryMovies} />
      </div>

      {/* Search Bar (Moved below Marquee) */}
      <div className="max-w-2xl mx-auto px-4 md:px-0 relative z-20">
        <form action="/" className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-2xl blur-md opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-300"></div>
          <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all group-hover:border-white/20">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                name="q"
                type="text" 
                defaultValue={query}
                placeholder="Search the cinematic universe..." 
                className="w-full bg-transparent pl-16 pr-6 py-5 md:py-6 text-lg md:text-xl text-white focus:outline-none placeholder-slate-500 tracking-wide"
              />
            </div>
            <button 
              type="submit" 
              className="px-10 py-5 md:py-6 bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-all flex-shrink-0"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results & AI Recommendations */}
      {query && (
        <div className="max-w-7xl mx-auto px-6 space-y-24 pb-20">
          {/* Main Search Results */}
          <section className="fade-in">
            <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
              <h2 className="text-3xl font-black text-white italic">Search Results</h2>
              <p className="text-slate-500 font-medium tracking-widest uppercase text-[10px]">Matching "{query}"</p>
            </div>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/10 border border-white/5 rounded-3xl">
                <h3 className="text-2xl font-bold text-slate-500">No exact matches. Check your vibe below.</h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12">
                {searchResults.slice(0, 10).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>

          {/* AI Vibe Matches */}
          {recommendations.length > 0 && (
            <section className="fade-in">
              <div className="flex justify-between items-end mb-10 border-b border-indigo-500/20 pb-6">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic font-serif">Similar Vibes</h2>
                <p className="text-indigo-400/60 font-medium tracking-widest uppercase text-[10px]">AI-Curated for You</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-12">
                {recommendations.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
