"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { notifyAdminOfNewUser, notifyUserOfApproval } from "./emailActions";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return { error: error.message };
  }

  // Check if profile exists and is approved
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile) {
    redirect("/setup");
  }

  if (!profile.is_approved && !profile.is_admin) {
    redirect("/pending");
  }
  
  redirect("/");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({ email, password });
  
  if (error) {
    return { error: error.message };
  }

  // Redirect to setup to get their name
  redirect("/setup");
}

export async function saveProfile(formData: FormData) {
  const full_name = formData.get("full_name") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check if this is the first user (admin)
  const isAdmin = user.email === "yadusrajiv@gmail.com";

  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    full_name,
    email: user.email,
    is_approved: isAdmin, // Admin is auto-approved
    is_admin: isAdmin
  });

  if (error) {
    return { error: error.message };
  }

  if (isAdmin) {
    redirect("/");
  } else {
    // Notify admin
    await notifyAdminOfNewUser(full_name, user.email || "");
    redirect("/pending");
  }
}

export async function approveUser(userId: string) {
  const supabase = await createClient();
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, email, id')
    .eq('id', userId)
    .single();

  if (profileError) return { error: profileError.message };

  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: true })
    .eq('id', userId);

  if (error) return { error: error.message };

  // Notify user
  await notifyUserOfApproval(profile.full_name, profile.email);

  revalidatePath("/admin");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
