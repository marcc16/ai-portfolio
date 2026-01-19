"use client";

import { useEffect } from "react";

/**
 * Hook to ensure guest users have a persistent session ID
 * This helps track rate limits per browser session instead of just per IP
 */
export function useGuestSession() {
  useEffect(() => {
    // Check if guest_session_id cookie exists
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const hasGuestSession = cookies.some((c) => c.startsWith("guest_session_id="));

    if (!hasGuestSession) {
      // Create a unique guest session ID
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Set cookie with 30 days expiration
      const expirationDays = 30;
      const expires = new Date();
      expires.setTime(expires.getTime() + expirationDays * 24 * 60 * 60 * 1000);

      document.cookie = `guest_session_id=${guestId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

      console.log("[use-guest-session] Created new guest session ID:", guestId);
    }
  }, []);
}
