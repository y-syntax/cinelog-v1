import LikeButton from "@/components/LikeButton";
import { formatDate } from "@/utils/dateFormatter";

export default function ReviewCard({ review, isCurrentUser = false }) {
  const date = formatDate(review.created_at);

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
      isCurrentUser 
        ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
        : 'bg-white/5 border-white/10 hover:bg-white/10'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-lg">
              {review.reviewer_name}
              {isCurrentUser && <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wider">You</span>}
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{date}</p>
        </div>
        <div className="bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5 shadow-inner">
          <span className="text-yellow-400 text-sm">⭐</span>
          <span className="text-white font-black text-sm">{Number(review.rating).toFixed(1)}</span>
        </div>
      </div>
      
      <div className="relative mb-4">
        <p className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap italic">
          "{review.review_text}"
        </p>
      </div>

      <div className="flex justify-end border-t border-white/5 pt-4">
        <LikeButton reviewId={review.id} initialLikes={review.likes_count} />
      </div>
    </div>
  );
}
