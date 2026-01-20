"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { WORKFLOW_ID } from "@/lib/config";
import { hasRemainingMessages, incrementMessageCount } from "@/lib/message-tracking";

/**
 * Get user's subscription plan from Clerk
 * Checks both subscriptions and public metadata
 */
async function getUserPlan(userId: string): Promise<"free" | "recruiter"> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Check if user has active subscription to "recruiter" plan
    // Clerk stores subscriptions in organizationMemberships or publicMetadata
    // @ts-ignore
    const subscriptions = user.organizationMemberships || [];
    const hasRecruiterPlan = subscriptions.some(
      (membership: any) => membership.organization?.publicMetadata?.plan === "recruiter"
    );

    if (hasRecruiterPlan) return "recruiter";

    // Also check public metadata for manual assignments
    const plan = user.publicMetadata?.subscriptionPlan as string | undefined;
    if (plan === "recruiter") return "recruiter";

    // Check private metadata (set by Clerk Billing webhooks)
    const privateMetadataPlan = user.privateMetadata?.subscriptionPlan as string | undefined;
    if (privateMetadataPlan === "recruiter") return "recruiter";

    return "free";
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return "free";
  }
}

/**
 * Get message limit based on user status and plan
 */
function getMessageLimit(isGuest: boolean, plan: "free" | "recruiter"): number {
  if (isGuest) return 3;
  if (plan === "recruiter") return 10; // Changed from 20 to 10
  return 5; // free authenticated users
}

export async function createSession() {
  const { userId } = await auth();
  const isGuest = !userId;

  // Get user's plan if authenticated
  const plan = userId ? await getUserPlan(userId) : "free";
  const messageLimit = getMessageLimit(isGuest, plan);

  // Get identifier for tracking
  let identifier: string;
  if (userId) {
    identifier = userId;
  } else {
    // For guests, use IP address
    const { headers, cookies } = await import("next/headers");
    const forwardedFor = (await headers()).get("x-forwarded-for");
    const realIp = (await headers()).get("x-real-ip");

    // Use IP address combined with a fixed prefix for consistent tracking
    // We ignore the guest ID from cookies because it's not reliably persisted/set
    // Using IP ensures that rate limits apply per network identity
    const ipAddress = forwardedFor || realIp || "unknown";

    // Fallback for local development or when IP is hidden
    if (ipAddress === "unknown") {
      const cookieStore = await cookies();
      let guestId = cookieStore.get("guest_session_id")?.value;
      if (!guestId) {
        guestId = `guest_${Date.now()}`;
      }
      identifier = `ip_unknown:${guestId}`;
    } else {
      identifier = `ip:${ipAddress}`;
    }

    // Log for debugging
    console.log("[create-session] Guest identifier:", {
      forwardedFor,
      realIp,
      identifier,
      isDev: process.env.NODE_ENV === "development"
    });
  }

  // TEMPORARILY DISABLED FOR DEBUGGING - Rate limit check
  // TODO: Re-enable after fixing login issue
  /*
  const { allowed, remaining, limit } = await hasRemainingMessages(
    identifier,
    isGuest,
    messageLimit
  );

  if (!allowed) {
    const errorMessage = isGuest
      ? `Has alcanzado el límite de ${limit} mensajes diarios. Inicia sesión para obtener ${getMessageLimit(false, "free")} mensajes al día.`
      : plan === "recruiter"
        ? `Has alcanzado el límite de ${limit} mensajes diarios. Vuelve mañana para continuar.`
        : `Has alcanzado el límite de ${limit} mensajes diarios. Actualiza a Recruiter para obtener ${getMessageLimit(false, "recruiter")} mensajes al día.`;

    throw new Error(errorMessage);
  }
  */

  // Allow anonymous users - generate a guest ID
  const sessionUserId = userId || `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  if (!WORKFLOW_ID) {
    throw new Error("WORKFLOW_ID not configured");
  }

  // Create ChatKit session with Clerk user ID or guest ID
  const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "chatkit_beta=v1",
    },
    body: JSON.stringify({
      workflow: { id: WORKFLOW_ID },
      user: sessionUserId,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create session: ${error}`);
  }

  const data = await response.json();

  // TODO: Move message counting to actual message send event
  // Currently this increments the counter when opening the chat, not when sending messages
  // This causes the "limit reached" message to appear even if no messages were sent
  //
  // Solutions:
  // 1. Use ChatKit webhooks to track when messages are actually sent
  // 2. Create a separate API endpoint that increments the counter and call it from the client
  // 3. Use ChatKit's onMessageSent callback if available
  //
  // For now, we ONLY check the limit but DO NOT increment it here
  // await incrementMessageCount(identifier, isGuest, messageLimit);

  return data.client_secret as string;
}

/**
 * Get current message usage for the user/guest
 */
export async function getMessageUsage() {
  const { userId } = await auth();
  const isGuest = !userId;

  // Get user's plan if authenticated
  const plan = userId ? await getUserPlan(userId) : "free";
  const messageLimit = getMessageLimit(isGuest, plan);


  let identifier: string;
  if (userId) {
    identifier = userId;
  } else {
    const { headers, cookies } = await import("next/headers");
    const forwardedFor = (await headers()).get("x-forwarded-for");
    const realIp = (await headers()).get("x-real-ip");

    // Try to get guest session ID from cookie
    const cookieStore = await cookies();
    let guestId = cookieStore.get("guest_session_id")?.value;

    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    const ipAddress = forwardedFor || realIp || "unknown";
    identifier = `${guestId}:${ipAddress}`;
  }

  const usage = await hasRemainingMessages(identifier, isGuest, messageLimit);

  return {
    ...usage,
    plan, // Include plan info in response
  };
}

/**
 * Get user's current subscription plan
 * Useful for showing upgrade prompts
 */
export async function getCurrentPlan(): Promise<"free" | "recruiter"> {
  const { userId } = await auth();
  if (!userId) return "free";
  return getUserPlan(userId);
}
