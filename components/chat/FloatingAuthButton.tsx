"use client";

import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingAuthButtonProps {
  isSignedIn: boolean;
  remaining: number;
  limit: number;
}

export function FloatingAuthButton({
  isSignedIn,
  remaining,
  limit,
}: FloatingAuthButtonProps) {
  const percentage = (remaining / limit) * 100;
  const isLow = percentage <= 33;

  // Don't show if user is signed in or has plenty of messages
  if (isSignedIn || remaining > 1) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-[2px] rounded-full shadow-lg">
        <div className="bg-background rounded-full px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-orange-500" />
            <span className="font-medium">
              {remaining === 0 ? "Sin mensajes" : `${remaining} mensaje restante`}
            </span>
          </div>
          <SignInButton mode="modal">
            <Button size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar sesión para más
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
