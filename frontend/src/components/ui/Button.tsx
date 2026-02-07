import { forwardRef } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          "relative inline-flex items-center justify-center gap-2",
          "rounded-[var(--radius)] font-medium transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // sizes
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6 text-sm",

          // variants
          variant === "primary" &&
            "bg-gradient-to-r from-accent to-accent-2 text-white shadow-lg shadow-accent/20 hover:shadow-accent/35",

          variant === "secondary" &&
            "bg-card-2 text-fg border border-border hover:bg-card",

          variant === "ghost" &&
            "bg-transparent text-fg hover:bg-card",

          className
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        <span className={loading ? "opacity-70" : ""}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
