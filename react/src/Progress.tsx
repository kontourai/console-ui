export interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const normalized = Math.max(0, Math.min(100, value || 0));
  return (
    <div className={["progress", className].filter(Boolean).join(" ")}>
      <span style={{ width: `${normalized}%` }} />
    </div>
  );
}
