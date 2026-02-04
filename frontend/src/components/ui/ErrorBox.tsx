export default function ErrorBox({
  title = "Something went wrong",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-4">
      <div className="text-sm text-red-200 font-medium">{title}</div>
      <div className="text-xs text-red-200/80 mt-1 whitespace-pre-wrap">
        {message}
      </div>
    </div>
  );
}
