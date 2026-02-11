interface Props {
  message?: string;
}

export default function EmptyState({ message = "No data available." }: Props) {
  return <p>{message}</p>;
}
