"use client";

import Link from 'next/link';

export default function PendingPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-slate-900 border border-white/5 rounded-[2rem] shadow-[0_0_50px_rgba(99,102,241,0.15)] glass fade-in text-center">
      <div className="mb-6 inline-flex p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor"/>
        </svg>
      </div>

      <h1 className="text-4xl font-black text-white mb-3 gradient-text">Approval Pending</h1>
      <p className="text-slate-400 mb-8 font-medium">Your request to join CineLog has been sent to the admin. You'll receive an email once you're approved.</p>
      
      <div className="space-y-4">
        <div className="p-4 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-slate-300 font-medium">
          Sit tight! This usually takes less than 24 hours.
        </div>

        <Link 
          href="/login" 
          className="block w-full py-4 text-slate-400 hover:text-white font-bold transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}
