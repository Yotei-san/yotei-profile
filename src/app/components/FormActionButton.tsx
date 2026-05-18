"use client";

import type { CSSProperties, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  idleLabel: string;
  pendingLabel: string;
  style: CSSProperties;
  disabled?: boolean;
  className?: string;
  formAction?: string | ((formData: FormData) => void | Promise<void>);
  children?: ReactNode;
};

export default function FormActionButton({
  idleLabel,
  pendingLabel,
  style,
  disabled = false,
  className,
  formAction,
  children,
}: Props) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      className={className}
      type="submit"
      formAction={formAction}
      disabled={isDisabled}
      aria-busy={pending}
      style={{
        ...style,
        minHeight: style.minHeight ?? "46px",
        display: style.display ?? "inline-flex",
        alignItems: style.alignItems ?? "center",
        justifyContent: style.justifyContent ?? "center",
        gap: style.gap ?? "10px",
        textAlign: style.textAlign ?? "center",
        opacity: isDisabled ? 0.72 : 1,
        cursor: isDisabled ? "not-allowed" : style.cursor,
      }}
    >
      {children}
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
