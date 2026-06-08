import { normalizedClassSuffix, toneClass, toneForValue, type SemanticTone } from "./tones.js";

export type StatusBadgeStatus = string;

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  tone?: SemanticTone;
  className?: string;
}

export function StatusBadge({ status, tone = toneForValue(status), className }: StatusBadgeProps) {
  const statusClass = `status-${normalizedClassSuffix(status)}`;
  return <div className={["status", statusClass, toneClass(tone), className].filter(Boolean).join(" ")}>{status}</div>;
}
