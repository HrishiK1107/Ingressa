import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Drawer({ open, onClose, children }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 999,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "480px",
          height: "100vh",
          backgroundColor: "#ffffff",
          padding: "28px",
          overflowY: "auto",
          zIndex: 1000,
          boxShadow: "-8px 0 24px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
        }}
      >
<button
  onClick={onClose}
  style={{
    alignSelf: "flex-end",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 500,
    padding: "4px 6px",
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.color = "#111827")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.color = "#6b7280")
  }
>
  ✕ Close
</button>


        <div style={{ marginTop: "12px" }}>{children}</div>
      </div>
    </>
  );
}
