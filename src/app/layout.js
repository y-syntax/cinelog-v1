import './globals.css';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/app/actions/authActions';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'CineLog - Your Beautiful Movie Journal',
  description: 'Track, review, and discover movies with AI',
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-slate-900 text-slate-50 selection:bg-indigo-500/30">
        {/* Top Desktop Nav */}
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="text-2xl md:text-3xl font-extrabold tracking-tighter gradient-text hover:opacity-80 transition-opacity">
                CineLog
              </Link>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex gap-8 items-center font-bold text-sm tracking-wide">
                <Link href="/" className="hover:text-indigo-400 transition-colors">Search</Link>
                {user && <Link href="/my-movies" className="hover:text-indigo-400 transition-colors">My Journal</Link>}
                
                {user ? (
                  <form action={logout}>
                    <button type="submit" className="text-slate-300 hover:text-white bg-white/5 py-2 px-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      Logout
                    </button>
                  </form>
                ) : (
                  <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Logout (Hidden if not logged in) */}
              <div className="md:hidden">
                {user ? (
                   <form action={logout}>
                    <button type="submit" className="text-slate-400 hover:text-white p-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                       </svg>
                    </button>
                  </form>
                ) : (
                  <Link href="/login" className="text-indigo-400 font-bold text-sm">Login</Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Mobile Nav */}
        <nav className="fixed bottom-0 w-full z-50 md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 pb-safe">
          <div className="grid grid-cols-2 h-16">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-[10px] uppercase font-bold tracking-widest">Search</span>
            </Link>
            <Link href={user ? "/my-movies" : "/login"} className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-[10px] uppercase font-bold tracking-widest">Journal</span>
            </Link>
          </div>
        </nav>

        <main className="flex-1 mt-20 md:mt-28 mb-20 md:mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
