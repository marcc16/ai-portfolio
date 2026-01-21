"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
    const { handleRedirectCallback } = useClerk();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            try {
                console.log('[SSO Callback] Starting authentication callback...');

                // Wait for Clerk to process the callback
                await handleRedirectCallback({
                    signInForceRedirectUrl: "/",
                    signUpForceRedirectUrl: "/",
                });

                console.log('[SSO Callback] Callback processed, waiting for session...');

                // Give Clerk time to set the session cookies
                await new Promise(resolve => setTimeout(resolve, 500));

                console.log('[SSO Callback] Refreshing router...');

                // Force Next.js to invalidate its cache
                router.refresh();

                // Wait a bit more for the refresh to complete
                await new Promise(resolve => setTimeout(resolve, 300));

                console.log('[SSO Callback] Redirecting to home with hard reload...');

                // Force a hard reload to ensure all components detect the new session
                window.location.href = "/";
            } catch (err) {
                console.error("[SSO Callback] Error processing callback:", err);
                // If there's an error, still try to redirect
                window.location.href = "/";
            }
        };

        processCallback();
    }, [handleRedirectCallback, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black/95">
            <div className="flex flex-col items-center gap-4 text-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">
                    Finalizando autenticación...
                </p>
            </div>
        </div>
    );
}
