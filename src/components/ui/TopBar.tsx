import { Button } from "@/components/ui/Button";

type TopBarProps = {
  name?: string;
};

export default function TopBar({ name = "" }: TopBarProps) {
  return (
    <nav className="border-b border-slate-200 bg-white px-8 py-4 text-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <span className="font-semibold">{name}</span>
        <form className="flex w-full max-w-md items-center gap-2" role="search">
          <label className="sr-only" htmlFor="search">
            Search
          </label>
          <input
            className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
            id="search"
            name="search"
            placeholder="Search"
            type="search"
          />
          <button
            className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
            type="submit"
          >
            Search
          </button>
        </form>
        <Button variant="ghost" size="md">
          Profile
        </Button>
        <Button variant="ghost" size="md">
          Notifications
        </Button>
        <Button variant="primary" size="md">
         Create Test Case
        </Button>
      </div>
    </nav>
  );
}