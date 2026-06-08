import type { ReactNode } from "react";

export interface PanelProps {
  title: string;
  count: number;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, count, children, className }: PanelProps) {
  return (
    <section className={["panel", className].filter(Boolean).join(" ")}>
      <div className="panel-head">
        <h2>{title}</h2>
        <span>{count}</span>
      </div>
      {children}
    </section>
  );
}
