import { prisma } from "@/lib/prisma";
import CreateTestCaseForm from "@/components/test-cases/CreateTestCaseForm";
import TestCaseFilters from "@/components/test-cases/TestCaseFilters";
import SideBar from "@/components/ui/SideBar";
import Table, { type TableField } from "@/components/ui/Table";
import Link from "next/link";

//Defines data type
type TestCaseRow = {
  id: number;
  title: string;
  feature: string;
  priority: string;
  status: string;
  stepsCount: number;
  updatedAt: string;
};

//data that the table will take
const fields: TableField<TestCaseRow>[] = [
  {
    field: "title",
    label: "Title",
    render: ({ id, title }) => (
      <Link className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline" href={`/test-cases/${id}`}>
        {title}
      </Link>
    ),
  },
  { field: "feature", label: "Feature" },
  { field: "priority", label: "Priority" },
  { field: "status", label: "Status" },
  { field: "stepsCount", label: "Steps" },
  { field: "updatedAt", label: "Updated" },
];

//Where it receives search params aka link
type TestCaseSearchParams = {
  search?: string | string[];
  status?: string | string[];
  priority?: string | string[];
  feature?: string | string[];
};

//consts for the table
const statuses = ["Not Run", "Pass", "Fail", "Blocked", "Skipped"] as const;
const priorities = ["Low", "Medium", "High"] as const;

//makes it so search parameters in link dont become undefined
function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TestCasesPage({
  searchParams,
}: {
  searchParams: Promise<TestCaseSearchParams>;
}) {
  const params = await searchParams;
  const search = firstValue(params.search)?.trim() ?? "";
  const requestedStatus = firstValue(params.status) ?? "";
  const requestedPriority = firstValue(params.priority) ?? "";
  const feature = firstValue(params.feature) ?? "";
  const status = statuses.find((value) => value === requestedStatus);
  const priority = priorities.find((value) => value === requestedPriority);

  const [records, featureRecords] = await Promise.all([
    //https://www.prisma.io/docs/orm/v6/prisma-client/queries/filtering-and-sorting
    prisma.testCase.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { feature: { contains: search } },
              ],
            }
          : {}),
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(feature ? { feature } : {}),
      },
      select: {
        id: true,
        title: true,
        feature: true,
        priority: true,
        status: true,
        updatedAt: true,
        _count: { select: { steps: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    //Used to find all projects for top filter
    prisma.testCase.findMany({
      distinct: ["feature"],
      select: { feature: true },
      orderBy: { feature: "asc" },
    }),
  ]);

  const testCases: TestCaseRow[] = records.map((testCase) => ({
    id: testCase.id,
    title: testCase.title,
    feature: testCase.feature,
    priority: testCase.priority,
    status: testCase.status,
    stepsCount: testCase._count.steps,
    updatedAt: testCase.updatedAt.toLocaleDateString(),
  }));
  return (
    <main className="min-h-screen bg-slate-50 pl-64">
      <SideBar />

      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10 lg:py-10">
        <CreateTestCaseForm />

        <div className="mt-8">
        <TestCaseFilters
          feature={feature}
          features={featureRecords.map((record) => record.feature)}
          priorities={priorities}
          priority={priority ?? ""}
          search={search}
          searchResults={testCases.map(({ id, title }) => ({ id, title }))}
          statuses={statuses}
          status={status ?? ""}
        />
        </div>

        <Table
          name={`Test Cases (${testCases.length})`}
          data={testCases}
          fields={fields}
          getRowKey={({ id }) => id}
        />
      </div>
    </main>
  );
}
