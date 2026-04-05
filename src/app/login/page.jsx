"use client";

import { useState } from 'react';
import { login, signup } from '@/app/actions/authActions';

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = isSignUp ? await signup(formData) : await login(formData);
      if (res?.error) setError(res.error);
    } catch (err) {
      if (err.message && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      setError('An unexpected error occurred. Please verify your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-slate-900 border border-white/5 rounded-[2rem] shadow-[0_0_50px_rgba(99,102,241,0.15)] glass fade-in">
      <h1 className="text-4xl font-black text-white mb-3 gradient-text">
        {isSignUp ? 'Join CineLog' : 'Welcome Back'}
      </h1>
      <p className="text-slate-400 mb-8 font-medium">
        {isSignUp ? 'Create an account to start reviewing movies.' : 'Log in to review and categorize your cinematic experiences.'}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-red-400 bg-red-500/10 p-4 border border-red-500/20 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 tracking-wide uppercase">Email Address</label>
          <input 
            type="email" 
            name="email"
            required 
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            placeholder="owner@cinelog.app"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 tracking-wide uppercase">Password</label>
          <input 
            type="password" 
            name="password"
            required 
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-black text-white rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25"
        >
          {loading ? 'Authenticating...' : (isSignUp ? 'Sign Up to CineLog' : 'Sign In to Journal')}
        </button>

        <p className="text-center text-slate-400 font-medium text-sm mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-indigo-400 hover:text-indigo-300 font-bold underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  );
}
