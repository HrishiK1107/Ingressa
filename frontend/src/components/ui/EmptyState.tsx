interface Props {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "Nothing here",
  message = "No data available.",
}: Props) {
  return (
    <div className="py-12 text-center text-muted">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-80">{message}</p>
    </div>
  );
}
