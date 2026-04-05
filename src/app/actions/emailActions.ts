"use server";

import { resend } from '@/utils/resend';

const ADMIN_EMAIL = "yadusrajiv@gmail.com";

export async function notifyAdminOfNewUser(userName: string, userEmail: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing. Email not sent.");
      return;
    }

    await resend.emails.send({
      from: 'CineLog <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: 'New User Access Request',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6366f1;">New CineLog Request</h2>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p>This user has signed up and is waiting for your approval.</p>
          <a href="https://cinelog.app/admin" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Admin Dashboard</a>
        </div>
      `
    });
  } catch (error) {
    console.error("Failed to notify admin:", error);
  }
}

export async function notifyUserOfApproval(userName: string, userEmail: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is missing. Email not sent.");
      return;
    }

    await resend.emails.send({
      from: 'CineLog <onboarding@resend.dev>',
      to: userEmail,
      subject: 'Welcome to CineLog! Your account is approved',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6366f1;">Welcome aboard, ${userName}!</h2>
          <p>Your account has been approved by the admin. You can now add your movie reviews and search for your next favorite film.</p>
          <a href="https://cinelog.app/" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Start Reviewing</a>
        </div>
      `
    });
  } catch (error) {
    console.error("Failed to notify user:", error);
  }
}
