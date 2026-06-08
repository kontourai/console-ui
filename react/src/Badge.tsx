import { toneClass, toneForValue, type SemanticTone } from "./tones.js";

export interface BadgeProps {
  value: string;
  tone?: SemanticTone;
  className?: string;
}

export function Badge({ value, tone = toneForValue(value), className }: BadgeProps) {
  return <span className={["badge", toneClass(tone), className].filter(Boolean).join(" ")}>{value}</span>;
}
