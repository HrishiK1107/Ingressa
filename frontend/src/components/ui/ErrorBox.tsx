import clsx from "clsx";

interface Props {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorBox({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  actionLabel,
  onAction,
}: Props) {
  return (
    <div
      className={clsx(
        "border border-red-500/40",
        "bg-red-950/30",
        "text-red-200",
        "rounded-md",
        "p-4",
        "max-w-xl"
      )}
    >
      <h3 className="font-semibold mb-1">{title}</h3>

      <p className="text-sm opacity-90 mb-3">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={clsx(
            "text-sm",
            "border border-red-400/40",
            "px-3 py-1 rounded",
            "hover:bg-red-900/40"
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
