import type { ReactNode } from "react";

export type TableRow = {
  type?: string;
  name: string;
  description: string;
};

export type TableField<Row extends object = TableRow> = {
  field: keyof Row;
  label: string;
  render?: (row: Row) => ReactNode;
};

type TableProps<Row extends object> = {
  name: string;
  data: Row[];
  fields?: TableField<Row>[];
  getRowKey?: (row: Row, index: number) => string | number;
};

export default function Table<Row extends object>({
  name,
  data,
  fields,
  getRowKey,
}: TableProps<Row>) {
  const defaultFields = [
    { field: "type", label: "Type" },
    { field: "name", label: "Name" },
    { field: "description", label: "Description" },
  ] as unknown as TableField<Row>[];
  const tableFields = fields ?? defaultFields;

  return (
    <div className="mt-8 w-full overflow-x-auto rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">{name}</h2>
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            {tableFields.map(({ field, label }) => (
              <th key={String(field)} className="px-4 py-3">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={getRowKey?.(row, rowIndex) ?? rowIndex}
              className="border-t border-slate-200"
            >
              {tableFields.map(({ field, render }) => (
                <td key={String(field)} className="px-4 py-3">
                  {render ? render(row) : String(row[field] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
