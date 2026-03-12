"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExplainResponse } from "@/lib/api";

interface ResultsProps {
  data: ExplainResponse;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Results({ data }: ResultsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto mt-12 max-w-2xl space-y-4"
    >
      <h2 className="font-display text-xl font-semibold text-white">
        Explanations
      </h2>

      {data.explanations.map((text, i) => (
        <motion.div
          key={i}
          variants={item}
          className={cn(
            "rounded-xl border border-white/10 bg-zinc-900/50 p-5 shadow-lg",
            "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/5"
          )}
        >
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-primary-500">
            Explanation {i + 1}
          </span>
          <p className="text-zinc-300 leading-relaxed">{text}</p>
        </motion.div>
      ))}

      <motion.div
        variants={item}
        className={cn(
          "rounded-xl border border-primary-500/30 bg-primary-500/10 p-5",
          "shadow-red-glow transition-all duration-300 hover:-translate-y-1"
        )}
      >
        <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
          <Lightbulb className="h-4 w-4" />
          One thing this person would care about most
        </span>
        <p className="text-primary-200 leading-relaxed">{data.key_insight}</p>
      </motion.div>
    </motion.div>
  );
}
