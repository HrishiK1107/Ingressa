import { useState } from "react";
import { useAssets } from "../hooks/useAssets";
import { AssetsTable } from "../components/console/AssetsTable";
import { Loading } from "../components/ui/Loading";
import { ErrorBox } from "../components/ui/ErrorBox";
import { EmptyState } from "../components/ui/EmptyState";

export default function Assets() {
  const [assetType, setAssetType] = useState("");
  const [region, setRegion] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, refetch } = useAssets({
    asset_type: assetType || undefined,
    region: region || undefined,
    q: query || undefined,
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <ErrorBox
        title="Failed to load assets"
        message="Unable to fetch asset inventory."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        title="No assets found"
        message="No assets match the selected filters."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Assets</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          className="border border-border bg-background px-2 py-1 text-sm"
          placeholder="Asset type"
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
        />

        <input
          className="border border-border bg-background px-2 py-1 text-sm"
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <input
          className="border border-border bg-background px-2 py-1 text-sm"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <AssetsTable items={data.items} />
    </div>
  );
}
