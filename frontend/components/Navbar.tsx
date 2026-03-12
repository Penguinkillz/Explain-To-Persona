"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/5",
        "bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/40"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1350px] items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/20 text-primary-500 shadow-red-glow">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            Explain to a Persona
          </span>
        </div>
        <span className="rounded-md border border-primary-500/30 bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-primary-400">
          Beta
        </span>
      </div>
    </nav>
  );
}
