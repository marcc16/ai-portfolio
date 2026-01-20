import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
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
