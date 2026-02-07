import { useEffect, useRef, ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ open, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // ESC key
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Outside click
  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop (invisible, but clickable) */}
      <div className="fixed inset-0 z-40" />

      {/* Drawer */}
      <div
        ref={ref}
        className="
          fixed right-0 top-0 z-50
          h-full w-[420px]
          overflow-y-auto
          border-l border-border
          bg-background
        "
      >
        {children}
      </div>
    </>
  );
}
