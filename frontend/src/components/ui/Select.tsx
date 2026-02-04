import type { SelectHTMLAttributes } from "react";

export default function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={[
        "h-10 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white/80",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
