"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative py-16 text-center md:py-24"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.15),transparent)]" />
      <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
        <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
          Explain to a Persona
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
        Enter any concept, pick a persona, and get 2–3 short explanations in their voice — plus the one thing they&apos;d care about most.
      </p>
    </motion.section>
  );
}
