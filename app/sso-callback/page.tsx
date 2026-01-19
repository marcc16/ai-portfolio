"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

// Prevent static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function SSOCallback() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Completando autenticación...</p>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
