export interface MetricProps {
  label: string;
  value: string | number;
  className?: string;
}

export function Metric({ label, value, className }: MetricProps) {
  return (
    <div className={["metric", className].filter(Boolean).join(" ")}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
