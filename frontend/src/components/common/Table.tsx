import type { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

export default function Table<T>({
  data,
  columns,
  onRowClick,
}: Props<T>) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead
          style={{
            backgroundColor: "#f9fafb",
            textAlign: "left",
          }}
        >
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  padding: "12px 16px",
                  fontWeight: 600,
                  borderBottom: "1px solid #e5e7eb",
                  color: "#374151",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: "1px solid #f3f4f6",
                cursor: onRowClick ? "pointer" : "default",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                    "#f3f4f6";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                  "#ffffff";
              }}
            >
              {columns.map((col, colIndex) => {
                const value = row[col.accessor];

                return (
                  <td
                    key={colIndex}
                    style={{
                      padding: "12px 16px",
                      color: "#111827",
                    }}
                  >
                    {col.render
                      ? col.render(value, row)
                      : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
