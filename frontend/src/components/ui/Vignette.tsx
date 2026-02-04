import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Drawer({
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
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="absolute top-0 right-0 h-full w-[min(520px,92vw)] glass border-l border-white/10"
            initial={{ x: 520 }}
            animate={{ x: 0 }}
            exit={{ x: 520 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="h-14 px-5 flex items-center justify-between border-b border-white/10">
              <div className="text-sm text-white/85">{title}</div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-xl border border-white/10 text-white/60 hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-5 h-[calc(100%-56px)] overflow-auto">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
