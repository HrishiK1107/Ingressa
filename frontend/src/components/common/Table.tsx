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
    <div className="table-container">
      <table
        className="app-table"
        style={{
          minWidth: "1100px",
          tableLayout: "fixed",   // column stabilization
          width: "100%",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                style={{
                  padding: "16px 18px",
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
              className={onRowClick ? "clickable-row" : ""}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => {
                const value = row[col.accessor];

                return (
                  <td
                    key={String(col.accessor)}
                    style={{
                      padding: "16px 18px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
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
