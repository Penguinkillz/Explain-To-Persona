"use client";

import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 py-8">
      <div className="mx-auto max-w-[1350px] px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary-500" />
            <span className="font-display font-medium text-zinc-400">
              Explain to a Persona
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} — MVP. Future upgrades coming.
          </p>
        </div>
      </div>
    </footer>
  );
}
