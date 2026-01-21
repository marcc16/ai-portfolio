import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black/95">
            <div className="flex flex-col items-center gap-4 text-white">
                <div className="h-8 w-8 border-4 border-t-primary border-gray-700 rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Finalizando autenticación...</p>
            </div>

            {/* Este componente maneja el callback y redirige automáticamente */}
            <AuthenticateWithRedirectCallback
                signInForceRedirectUrl="/?auth=complete"
                signUpForceRedirectUrl="/?auth=complete"
            />
        </div>
    );
}
