import { useEffect, useRef, ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ open, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // ESC
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
    <div
      className="fixed right-5 top-5 bg-red-500 p-5 z-50"
    >
      <div
        ref={ref}
        className="
          pointer-events-auto
          fixed right-5 top-5
          w-[380px]
          max-h-[calc(100vh-40px)]
          overflow-y-auto
          border border-border
          bg-background
          p-5
        "
      >
        {children}
      </div>
    </div>
  );
}
