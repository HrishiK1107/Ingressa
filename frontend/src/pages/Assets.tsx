import { useAssets } from "../hooks/useAssets";

export default function Assets() {
  const { data, isLoading, error } = useAssets();

  if (isLoading) return <div>Loading assets...</div>;
  if (error) return <div>Error loading assets</div>;

  return (
    <div>
      <h1>Assets</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
