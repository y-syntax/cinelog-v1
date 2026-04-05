"use client";

import { useTransition } from 'react';
import { saveProfile } from '@/app/actions/authActions';

export default function SetupPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const res = await saveProfile(formData);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-slate-900 border border-white/5 rounded-[2rem] shadow-[0_0_50px_rgba(99,102,241,0.15)] glass fade-in">
      <h1 className="text-4xl font-black text-white mb-3 gradient-text">Almost There</h1>
      <p className="text-slate-400 mb-8 font-medium">Please let us know how we should address you in CineLog.</p>
      
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 tracking-wide uppercase">Your Full Name</label>
          <input 
            type="text" 
            name="full_name"
            required 
            autoFocus
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            placeholder="John Doe"
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-black text-white rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
        >
          {isPending ? 'Setting up...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}
