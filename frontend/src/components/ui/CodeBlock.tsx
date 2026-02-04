import { useMemo, useState } from "react";

export default function CodeBlock({
  value,
  title = "JSON",
}: {
  value: unknown;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    try {
      return typeof value === "string" ? value : JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }, [value]);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-white/15 overflow-hidden">
      <div className="h-10 px-4 flex items-center justify-between border-b border-white/10 bg-white/5">
        <div className="text-xs text-white/60">{title}</div>
        <button
          onClick={copy}
          className="text-xs text-white/70 border border-white/15 rounded-lg px-2 py-1 hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-xs text-white/70 overflow-auto bg-black/30">
        {text}
      </pre>
    </div>
  );
}
