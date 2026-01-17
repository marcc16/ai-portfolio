"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    handleRedirectCallback();
  }, [handleRedirectCallback]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Completando autenticación...</p>
    </div>
  );
}
