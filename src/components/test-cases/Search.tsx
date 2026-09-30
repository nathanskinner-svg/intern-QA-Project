"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  startingValue?: string;
  results: { id: number; title: string }[];
};

export default function Search({ startingValue = "", results }: Props) {
  const [search, setSearch] = useState(startingValue);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(`/test-cases?search=${encodeURIComponent(search)}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search, router]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  return (
    <div className="relative">
      <input
        autoComplete="off"
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
        id="search"
        name="search"
        onChange={handleChange}
        placeholder="Search test cases"
        type="search"
        value={search}
      />

      {search.trim() ? (
        <div className="absolute left-0 right-0 top-11 z-20 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {results.length > 0 ? (
            results.map((result) => (
              <Link
                className="block border-b border-slate-100 px-4 py-3 text-sm text-slate-700 last:border-0 hover:bg-indigo-50"
                href={`/test-cases/${result.id}`}
                key={result.id}
              >
                {result.title}
              </Link>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">No test cases found</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
