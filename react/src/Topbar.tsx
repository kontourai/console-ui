import type { ReactNode } from "react";

export interface TopbarMetaItem {
  label: string;
  value: ReactNode;
}

export interface TopbarProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  meta?: TopbarMetaItem[];
  actions?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function Topbar({ eyebrow, title, children, meta = [], actions, className, ariaLabel }: TopbarProps) {
  return (
    <section className={["topbar", className].filter(Boolean).join(" ")} aria-label={ariaLabel}>
      <div className="topbar-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children ? <div className="topbar-body">{children}</div> : null}
      </div>
      {meta.length ? (
        <div className="topbar-meta">
          {meta.map((item) => (
            <div className="topbar-meta-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
      {actions ? <div className="topbar-actions">{actions}</div> : null}
    </section>
  );
}
