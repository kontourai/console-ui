export interface EmptyProps {
  label: string;
  className?: string;
}

export function Empty({ label, className }: EmptyProps) {
  return <p className={["empty", className].filter(Boolean).join(" ")}>{label}</p>;
}
