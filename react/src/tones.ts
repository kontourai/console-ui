export type SemanticTone = "positive" | "caution" | "negative" | "active" | "neutral";

export interface ToneMatcher {
  tone: SemanticTone;
  pattern: RegExp;
}

export const toneMatchers: ToneMatcher[] = [
  { tone: "negative", pattern: /(failed|blocked|stale|error|rejected|bad|disconnected|disconnect)/i },
  { tone: "positive", pattern: /(passed|verified|fresh|completed|accepted|resolved|connected|good|success)/i },
  { tone: "caution", pattern: /(open|waiting|pending|warn|warning|hold|escalated)/i },
  { tone: "active", pattern: /(running|current|active|in-review|connecting|proposed)/i },
];

export function toneForValue(value: string | null | undefined, fallback: SemanticTone = "neutral"): SemanticTone {
  const normalized = String(value ?? "");
  return toneMatchers.find(({ pattern }) => pattern.test(normalized))?.tone ?? fallback;
}

export function toneClass(tone: SemanticTone): `tone-${SemanticTone}` {
  return `tone-${tone}`;
}

export function normalizedClassSuffix(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown";
}
