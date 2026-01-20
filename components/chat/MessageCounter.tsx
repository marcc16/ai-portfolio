"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageCounterProps {
  remaining: number;
  limit: number;
  className?: string;
}

export function MessageCounter({ remaining, limit, className }: MessageCounterProps) {
  const { isSignedIn } = useUser();
  const percentage = (remaining / limit) * 100;

  // Color based on remaining messages
  const getColor = () => {
    if (percentage > 60) return "text-green-600 dark:text-green-400";
    if (percentage > 30) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBarColor = () => {
    if (percentage > 60) return "bg-green-600 dark:bg-green-400";
    if (percentage > 30) return "bg-yellow-600 dark:bg-yellow-400";
    return "bg-red-600 dark:bg-red-400";
  };

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <MessageSquare className={cn("h-4 w-4", getColor())} />
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between">
          <span className={cn("font-medium", getColor())}>
            {remaining} de {limit}
          </span>
          <span className="text-xs text-muted-foreground">
            {isSignedIn ? "mensajes hoy" : "gratis"}
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300", getBarColor())}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
