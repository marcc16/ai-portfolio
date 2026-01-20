"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black/95">
            {/* Handle the callback and redirect to home */}
            <AuthenticateWithRedirectCallback
                signInForceRedirectUrl="/"
                signUpForceRedirectUrl="/"
            />
        </div>
    );
}
