export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center">
      <div className="text-white/90 font-medium">{title}</div>
      {description ? (
        <div className="text-white/50 text-sm mt-2">{description}</div>
      ) : null}
    </div>
  );
}
