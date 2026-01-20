"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SSOCallbackPage() {
    const { handleRedirectCallback } = useClerk();

    useEffect(() => {
        try {
            handleRedirectCallback({
                signInForceRedirectUrl: "/",
                signUpForceRedirectUrl: "/",
            });
        } catch (err) {
            console.error("Error handling redirect callback:", err);
        }
    }, [handleRedirectCallback]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black/95">
            <div className="flex flex-col items-center gap-4 text-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Finalizando autenticación...</p>
            </div>
        </div>
    );
}
