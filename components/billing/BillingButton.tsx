"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { BillingModal } from "./BillingModal";

export function BillingButton() {
  const [showBillingModal, setShowBillingModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowBillingModal(true)}
        className="group relative flex items-center justify-center w-12 h-12 md:w-12 md:h-12"
        title="Ver planes"
      >
        <div className="relative flex items-center justify-center w-full h-full rounded-full bg-white/10 dark:bg-white/5 group-hover/dock:bg-white/40 dark:group-hover/dock:bg-white/20 backdrop-blur-md border border-white/20 dark:border-white/10 group-hover/dock:border-white/50 dark:group-hover/dock:border-white/30 transition-all duration-500 ease-out hover:scale-125 hover:-translate-y-2 md:hover:-translate-y-3 hover:!bg-white/50 dark:hover:!bg-white/30 hover:!border-white/70 dark:hover:!border-white/40 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
          <div className="w-6 h-6 md:w-6 md:h-6 text-neutral-400/60 group-hover/dock:text-neutral-500 dark:text-neutral-300/60 dark:group-hover/dock:text-neutral-300 group-hover:!text-neutral-600 dark:group-hover:!text-neutral-200 transition-colors duration-300">
            <Sparkles className="h-full w-full" />
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute -top-9 md:-top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 text-xs md:text-sm font-medium text-neutral-200 whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
          Planes
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-black/90 border-r border-b border-white/20" />
        </div>
      </button>

      <BillingModal
        open={showBillingModal}
        onOpenChange={setShowBillingModal}
      />
    </>
  );
}
