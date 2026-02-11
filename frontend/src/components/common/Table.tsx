import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
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
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "900px",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                style={{
                  textAlign: "left",
                  padding: "14px",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
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
                cursor: onRowClick ? "pointer" : "default",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "rgba(255,255,255,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {columns.map((col) => {
                const value = row[col.accessor];

                return (
                  <td
                    key={String(col.accessor)}
                    style={{
                      padding: "14px",
                      fontSize: "14px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {col.render
                      ? col.render(value, row)
                      : typeof value === "object"
                      ? JSON.stringify(value)
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
