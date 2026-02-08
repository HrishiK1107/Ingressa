import type { Asset } from "../../api/types";
import { Table } from "../ui/Table";

interface Props {
  items: Asset[];
}

export function AssetsTable({ items }: Props) {
  const columns = [
    {
      key: "type",
      header: "Asset Type",
      render: (a: any) => a.asset_type ?? "—",
    },
    {
      key: "id",
      header: "Asset ID",
      render: (a: any) => a.asset_id ?? "—",
    },
    {
      key: "name",
      header: "Name",
      render: (a: any) => a.name ?? "—",
    },
    {
      key: "provider",
      header: "Provider",
      render: (_: any) => "aws", // backend does not send provider
    },
    {
      key: "region",
      header: "Region",
      render: (a: any) => a.region ?? "global",
    },
  ];

  return <Table columns={columns} data={items} />;
}
