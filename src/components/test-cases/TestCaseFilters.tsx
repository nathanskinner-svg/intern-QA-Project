import Link from "next/link";
import Search from "./Search";

type TestCaseFiltersProps = {
  search: string;
  status: string;
  priority: string;
  feature: string;
  statuses: readonly string[];
  priorities: readonly string[];
  features: string[];
  searchResults: { id: number; title: string }[];
};

export default function TestCaseFilters({
  search,
  status,
  priority,
  feature,
  statuses,
  priorities,
  features,
  searchResults,
}: TestCaseFiltersProps) {
  return (
    <form
      action="/test-cases"
      className="grid gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto]"
      method="get"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="search">
          Search
        </label>
        <Search results={searchResults} startingValue={search} />
      </div>

      <FilterSelect
        currentValue={status}
        emptyLabel="All statuses"
        label="Status"
        name="status"
        options={statuses}
      />
      <FilterSelect
        currentValue={priority}
        emptyLabel="All priorities"
        label="Priority"
        name="priority"
        options={priorities}
      />
      <FilterSelect
        currentValue={feature}
        emptyLabel="All features"
        label="Feature"
        name="feature"
        options={features}
      />

      <div className="flex items-end gap-2">
        <button className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700" type="submit">
          Apply
        </button>
        <Link className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100" href="/test-cases">
          Clear
        </Link>
      </div>
    </form>
  );
}

type FilterSelectProps = {
  currentValue: string;
  emptyLabel: string;
  label: string;
  name: string;
  options: readonly string[];
};

function FilterSelect({
  currentValue,
  emptyLabel,
  label,
  name,
  options,
}: FilterSelectProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={name}>
        {label}
      </label>
      <select
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
        defaultValue={currentValue}
        id={name}
        name={name}
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
