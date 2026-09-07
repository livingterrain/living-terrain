/**
 * Newsletter integration point.
 *
 * Future: wire to Resend, Buttondown, or similar.
 * Example with Resend:
 *
 *   import { Resend } from 'resend';
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID });
 */

export interface WaitlistSignup {
  email: string;
  source: "observatory" | "newsletter";
}

export interface WaitlistResult {
  success: boolean;
  message: string;
}

export async function subscribeToWaitlist(
  signup: WaitlistSignup,
): Promise<WaitlistResult> {
  const email = signup.email.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  return {
    success: false,
    message: "Email signup is not available yet. Please visit Living Terrain on Substack to subscribe.",
  };
}
