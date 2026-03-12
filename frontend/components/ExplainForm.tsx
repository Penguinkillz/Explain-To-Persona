"use client";

import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { explainConcept, explainFromFiles, type ExplainResponse } from "@/lib/api";
import { Results } from "./Results";
import { cn } from "@/lib/utils";

const PERSONAS = [
  "10-year-old",
  "Your grandma",
  "Skeptical investor",
  "Hiring manager",
  "Curious teenager",
] as const;

export function ExplainForm() {
  const [concept, setConcept] = useState("");
  const [persona, setPersona] = useState<string>(PERSONAS[0]);
  const [sourcesText, setSourcesText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFiles = files.length > 0;
  const hasSources = sourcesText.trim().length > 0;
  const useFilesEndpoint = hasFiles || (hasSources && !concept.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!concept.trim() && !hasSources && !hasFiles) {
      setError("Enter a concept, paste text, or upload a file.");
      return;
    }

    if (!persona) {
      setError("Pick a persona.");
      return;
    }

    setLoading(true);
    try {
      if (useFilesEndpoint) {
        const data = await explainFromFiles(
          concept.trim(),
          persona,
          sourcesText.trim(),
          files
        );
        setResult(data);
      } else {
        const data = await explainConcept(
          concept.trim(),
          persona,
          sourcesText.trim() || undefined
        );
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mx-auto max-w-[1350px] px-6"
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg shadow-black/20 md:p-8"
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Concept to explain <span className="text-primary-500">*</span>
            </label>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. blockchain, compound interest, or how vaccines work"
              rows={3}
              className={cn(
                "w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-zinc-500",
                "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              )}
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Persona
            </label>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className={cn(
                "w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white",
                "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              )}
              disabled={loading}
            >
              {PERSONAS.map((p) => (
                <option key={p} value={p} className="bg-zinc-900 text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">
              Source material <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="mb-2 block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-500/20 file:px-4 file:py-2 file:text-primary-400"
            />
            <textarea
              value={sourcesText}
              onChange={(e) => setSourcesText(e.target.value)}
              placeholder="Paste your notes or article text here."
              rows={4}
              className={cn(
                "w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-zinc-500",
                "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              )}
              disabled={loading}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white",
              "shadow-red-glow transition-all duration-200",
              "hover:scale-[1.02] hover:shadow-red-glow-lg",
              "disabled:scale-100 disabled:opacity-70 disabled:cursor-wait"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Thinking...
              </span>
            ) : (
              "Explain"
            )}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-primary-400">{error}</p>
        )}
      </form>

      {result && (
        <Results data={result} />
      )}
    </motion.section>
  );
}
