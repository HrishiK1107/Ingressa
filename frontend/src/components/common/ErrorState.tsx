interface Props {
  message?: string;
}

export default function ErrorState({ message = "Something went wrong." }: Props) {
  return <p style={{ color: "red" }}>{message}</p>;
}
