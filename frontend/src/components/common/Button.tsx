import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  ...props
}: Props) {
  const baseStyle = {
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "1px solid #ccc",
  };

  const variantStyle =
    variant === "primary"
      ? { backgroundColor: "#000", color: "#fff" }
      : { backgroundColor: "#f5f5f5", color: "#000" };

  return (
    <button style={{ ...baseStyle, ...variantStyle }} {...props}>
      {children}
    </button>
  );
}
