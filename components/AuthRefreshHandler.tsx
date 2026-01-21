"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * Componente que detecta cuando el usuario vuelve del SSO callback
 * y fuerza un refresh para asegurar que todos los componentes detecten la nueva sesión
 */
export function AuthRefreshHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const authComplete = searchParams.get("auth");

        if (authComplete === "complete") {
            console.log("[Auth Refresh] Detected auth completion, forcing refresh...");

            // Limpiar el query param de la URL
            const url = new URL(window.location.href);
            url.searchParams.delete("auth");

            // Reemplazar la URL sin el query param (sin agregar a historial)
            window.history.replaceState({}, "", url.toString());

            // Forzar un refresh completo de la página para asegurar detección de sesión
            window.location.reload();
        }
    }, [searchParams, router]);

    return null; // Este componente no renderiza nada
}
