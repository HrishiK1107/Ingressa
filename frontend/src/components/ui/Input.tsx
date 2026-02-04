import type { InputHTMLAttributes } from "react";

export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "h-10 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white/80",
        "placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
