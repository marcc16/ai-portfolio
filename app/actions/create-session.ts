"use server";

import { auth } from "@clerk/nextjs/server";
import { WORKFLOW_ID } from "@/lib/config";
import { hasRemainingMessages, incrementMessageCount } from "@/lib/message-tracking";

export async function createSession() {
  const { userId } = await auth();
  const isGuest = !userId;

  // Get identifier for tracking
  let identifier: string;
  if (userId) {
    identifier = userId;
  } else {
    // For guests, use IP address
    const { headers } = await import("next/headers");
    identifier = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  }

  // Check daily message limit
  const { allowed, remaining, limit } = await hasRemainingMessages(identifier, isGuest);

  if (!allowed) {
    const errorMessage = isGuest
      ? `Has alcanzado el límite de ${limit} mensajes diarios. Por favor, inicia sesión para continuar con hasta ${10} mensajes al día.`
      : `Has alcanzado el límite de ${limit} mensajes diarios. Vuelve mañana para continuar.`;

    throw new Error(errorMessage);
  }

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

  // Increment message count after successful session creation
  await incrementMessageCount(identifier, isGuest);

  return data.client_secret as string;
}

/**
 * Get current message usage for the user/guest
 */
export async function getMessageUsage() {
  const { userId } = await auth();
  const isGuest = !userId;

  let identifier: string;
  if (userId) {
    identifier = userId;
  } else {
    const { headers } = await import("next/headers");
    identifier = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
  }

  return hasRemainingMessages(identifier, isGuest);
}
