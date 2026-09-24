import Card from "@/components/ui/Card";
import { Graph } from "@/components/ui/Graph";

type DataDisplayProps = {
  name: string;
};

export default function DataDisplay({ name }: DataDisplayProps) {
  const statistics = [
    { label: "Total Test Cases", value: 24, valueClass: "text-slate-900" },
    { label: "Passed", value: 18, valueClass: "text-success" },
    { label: "Failed", value: 3, valueClass: "text-danger" },
    { label: "Not Run", value: 3, valueClass: "text-amber-600" },
  ];

  return (
    <section className="mt-8">
      <Card>
        <h2 className="mb-6 text-left text-xl font-semibold text-slate-900">
          {name}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map(({ label, value, valueClass }) => (
            <div key={label} className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className={`mt-2 text-3xl font-semibold ${valueClass}`}>
              {value}
            </p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-slate-200 pt-6 text-left">
          <Graph name="Progress" percent={75} />
        </div>
      </Card>
    </section>
  );
}