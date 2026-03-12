const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface ExplainResponse {
  concept: string;
  persona: string;
  explanations: string[];
  key_insight: string;
}

export async function explainConcept(
  concept: string,
  persona: string,
  sourcesText?: string | null
): Promise<ExplainResponse> {
  const res = await fetch(`${BASE}/api/explain-to-persona/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      concept,
      persona,
      sources_text: sourcesText || null,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `Server error ${res.status}`);
  }
  return res.json();
}

export async function explainFromFiles(
  concept: string,
  persona: string,
  sourcesText: string,
  files: File[]
): Promise<ExplainResponse> {
  const fd = new FormData();
  fd.append("concept", concept);
  fd.append("persona", persona);
  fd.append("sources_text", sourcesText);
  for (const f of files) fd.append("files", f);

  const res = await fetch(`${BASE}/api/explain-to-persona/explain-from-files`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || `Server error ${res.status}`);
  }
  return res.json();
}
