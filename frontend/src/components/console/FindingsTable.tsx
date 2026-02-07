import type { Finding } from "../../api/types";

interface Props {
  items: Finding[];
  onSelect: (finding: Finding) => void;
}

export function FindingsTable({ items, onSelect }: Props) {
  return (
    <table border={1} cellPadding={8}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Severity</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((f) => (
          <tr
            key={f.finding_id}
            onClick={() => {
              console.log("Finding clicked:", f.finding_id);
              onSelect(f);
            }}
            style={{ cursor: "pointer" }}
          >
            <td>{f.finding_id}</td>
            <td>{f.severity}</td>
            <td>{f.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
