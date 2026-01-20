"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SSOCallbackPage() {
    const router = useRouter();

    return (
        <AuthenticateWithRedirectCallback
            afterSignInUrl="/"
            afterSignUpUrl="/"
            redirectUrl="/"
        />
    );
}
