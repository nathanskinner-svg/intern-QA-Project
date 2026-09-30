
import CreateBugForm from "@/components/bugs/CreateBugForm";
import SideBar from "@/components/ui/SideBar";
import Table, { type TableField } from "@/components/ui/Table";
import { prisma } from "@/lib/prisma";

type BugRow = {
  id: number;
  title: string;
  testCase: string;
  severity: string;
  status: string;
  updatedAt: string;
};

const fields: TableField<BugRow>[] = [
  { field: "title", label: "Title" },
  { field: "testCase", label: "Test Case" },
  { field: "severity", label: "Severity" },
  { field: "status", label: "Status" },
  { field: "updatedAt", label: "Updated" },
];

export default async function BugsPage() {
  const [records, testCases] = await Promise.all([
    prisma.bug.findMany({
      select: {
        id: true,
        title: true,
        severity: true,
        status: true,
        updatedAt: true,
        testCase: { select: { title: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.testCase.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const bugs: BugRow[] = records.map((bug) => ({
    id: bug.id,
    title: bug.title,
    testCase: bug.testCase.title,
    severity: bug.severity,
    status: bug.status,
    updatedAt: bug.updatedAt.toLocaleDateString(),
  }));

  return (
    <main className="min-h-screen bg-slate-50 pl-64">
      <SideBar />
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 lg:py-10">
        <CreateBugForm testCases={testCases} />
        {testCases.length === 0 ? (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Create a test case before reporting a bug.
          </p>
        ) : null}
        <Table
          data={bugs}
          fields={fields}
          getRowKey={({ id }) => id}
          name={`Bugs (${bugs.length})`}
        />
      </div>
    </main>
  );
}
