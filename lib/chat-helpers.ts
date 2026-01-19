"use client";

/**
 * Client-side helper to increment message count after a message is sent
 * This should be called after a message is successfully sent to the chat
 */
export async function incrementMessageCount(): Promise<{
  success: boolean;
  allowed: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const response = await fetch("/api/chat/increment-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        allowed: data.allowed ?? false,
        error: data.error,
      };
    }

    return {
      success: true,
      allowed: data.allowed,
      count: data.count,
    };
  } catch (error) {
    console.error("[incrementMessageCount] Error:", error);
    return {
      success: false,
      allowed: false,
      error: "Network error",
    };
  }
}

/**
 * TODO: Integrate this with ChatKit
 *
 * Options to trigger incrementMessageCount():
 *
 * 1. ChatKit Callbacks (if available):
 *    - Look for onMessageSent, onMessageSubmit, or similar callbacks in ChatKit
 *    - Call incrementMessageCount() in that callback
 *
 * 2. ChatKit Webhooks:
 *    - Configure ChatKit workflow to call a webhook when messages are sent
 *    - The webhook endpoint can increment the counter server-side
 *
 * 3. Manual Integration:
 *    - If ChatKit doesn't provide callbacks, you might need to wrap or intercept
 *      the message sending mechanism
 *
 * 4. Polling/Detection:
 *    - Listen to ChatKit state changes or DOM mutations to detect new messages
 *    - This is less reliable but could work as a fallback
 *
 * Example integration if ChatKit supports callbacks:
 * ```typescript
 * useChatKit({
 *   api: { getClientSecret: handleCreateSession },
 *   onMessageSent: async () => {
 *     const result = await incrementMessageCount();
 *     if (!result.allowed) {
 *       // Show rate limit modal
 *     }
 *   }
 * })
 * ```
 */
