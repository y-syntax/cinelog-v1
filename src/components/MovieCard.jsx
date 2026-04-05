"use client";

import { addExclusion } from '@/app/actions/userExclusions';
import Link from 'next/link';

export default function MovieCard({ movie, showExclude = false }) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/1e293b/ffffff?text=No+Poster';

  const handleExclude = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addExclusion(movie.id);
    } catch (err) {
      console.error("Failed to exclude movie:", err);
    }
  };

  return (
    <div className="group relative block rounded-2xl bg-slate-800 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(99,102,241,0.25)] hover:ring-1 hover:ring-indigo-500/50 overflow-hidden">
      <Link href={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] w-full relative">
          <img 
            src={posterUrl} 
            alt={movie.title || movie.movie_title} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
        </div>
        
        <div className="absolute bottom-0 left-0 p-3 md:p-5 w-full">
          <h3 className="text-sm md:text-lg font-bold text-white line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
            {movie.title || movie.movie_title}
          </h3>
          {movie.release_date && (
            <p className="text-[10px] md:text-xs font-medium text-slate-400 mt-1">{new Date(movie.release_date).getFullYear()}</p>
          )}
          {movie.rating && (
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/30">
                  ★ {Number(movie.rating).toFixed(1)}/10
                </span>
              </div>
              {movie.reviewer_name && (
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  Reviewed by {movie.reviewer_name}
                </span>
              )}
            </div>
          )}
          {movie.reasoning && (
             <p className="text-[10px] text-indigo-200/70 mt-2 line-clamp-2 italic leading-relaxed">
               "{movie.reasoning}"
             </p>
          )}
        </div>
      </Link>

      {/* Exclusion Button (X) */}
      <button 
        onClick={handleExclude}
        className="absolute top-3 right-3 p-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20"
        title="Not Interested"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
