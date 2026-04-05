import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { approveUser } from "@/app/actions/authActions";
import { revalidatePath } from "next/cache";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-10 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-center">
        <h1 className="text-2xl font-black text-red-400 mb-2">Access Denied</h1>
        <p className="text-slate-400">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Fetch pending users
  const { data: pendingUsers } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_approved', false)
    .order('updated_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-slate-900 border border-white/5 rounded-[2rem] shadow-2xl glass">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-white gradient-text">Admin Dashboard</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage user access and approvals.</p>
        </div>
        <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">
          {pendingUsers?.length || 0} Pending Requests
        </div>
      </div>

      <div className="grid gap-4">
        {pendingUsers?.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-6 bg-slate-950/50 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all group">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{u.full_name}</h3>
              <p className="text-slate-400 text-sm font-medium">{u.email}</p>
              <p className="text-slate-600 text-xs mt-1">Requested on {new Date(u.updated_at).toLocaleDateString()}</p>
            </div>
            
            <form action={async () => {
              "use server";
              await approveUser(u.id);
            }}>
              <button 
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Approve Access
              </button>
            </form>
          </div>
        ))}

        {pendingUsers?.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-slate-500 font-medium">All caught up! No pending requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
