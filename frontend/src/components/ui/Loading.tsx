export default function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center text-white/60">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded-full border border-white/40 border-t-transparent animate-spin" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
}
