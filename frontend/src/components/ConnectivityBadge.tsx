import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

type Status = "connected" | "disconnected" | "checking";

export default function ConnectivityBadge() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let alive = true;

    async function check() {
      try {
        await apiClient.get(ENDPOINTS.health());
        if (alive) setStatus("connected");
      } catch {
        if (alive) setStatus("disconnected");
      }
    }

    check();
    const t = setInterval(check, 10_000);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const label =
    status === "checking"
      ? "Checking…"
      : status === "connected"
      ? "Connected"
      : "Disconnected";

  const dot =
    status === "connected"
      ? "bg-green-400"
      : status === "disconnected"
      ? "bg-red-400"
      : "bg-white/40";

  const pill =
    status === "connected"
      ? "border-green-400/30 text-green-300 bg-green-500/10"
      : status === "disconnected"
      ? "border-red-400/30 text-red-300 bg-red-500/10"
      : "border-white/15 text-white/50 bg-white/5";

  return (
    <div
      className={[
        "h-8 px-3 rounded-full border",
        "flex items-center gap-2 text-xs tracking-wide",
        pill,
      ].join(" ")}
    >
      <span className={["h-2 w-2 rounded-full", dot].join(" ")} />
      <span>{label}</span>
    </div>
  );
}
