import type { ReactNode } from "react";

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-[min(640px,92vw)] rounded-3xl border border-white/15 glass overflow-hidden">
        <div className="h-12 px-5 flex items-center justify-between border-b border-white/10">
          <div className="text-sm text-white/85">{title}</div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-white/10 text-white/60 hover:bg-white/10"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
