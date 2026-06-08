import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "ghost" | "positive" | "caution" | "negative";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = "ghost", className, children, ...props }: ButtonProps) {
  return (
    <button className={["btn", `btn-${variant}`, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
}
