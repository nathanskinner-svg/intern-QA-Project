import DeleteTestCaseButton from "@/components/test-cases/DeleteTestCaseButton";
import EditTestCaseForm from "@/components/test-cases/EditTestCaseForm";
import SideBar from "@/components/ui/SideBar";
import { prisma } from "@/lib/prisma";
import { parseId } from "@/lib/validation/id";
import Link from "next/link";
import { notFound } from "next/navigation";

type TestCaseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TestCaseDetailPage({
  params,
}: TestCaseDetailPageProps) {
  const { id } = await params;
  const testCaseId = parseId(id);
  if (testCaseId === null) {
    notFound();
  }

  const testCase = await prisma.testCase.findUnique({
    where: { id: testCaseId },
    include: {
      steps: { orderBy: { position: "asc" } },
      bugs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!testCase) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pl-64">
      <SideBar />

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10 lg:py-10">
        <Link className="text-sm font-medium text-indigo-600 hover:text-indigo-800" href="/test-cases">
           Back to test cases
        </Link>

        <div className="mt-5">
          <EditTestCaseForm
            testCase={{
              id: testCase.id,
              title: testCase.title,
              feature: testCase.feature,
              preconditions: testCase.preconditions,
              expectedResult: testCase.expectedResult,
              actualResult: testCase.actualResult,
              priority: testCase.priority,
              status: testCase.status,
              steps: testCase.steps.map((step) => ({
                key: step.id,
                action: step.action,
                expectedOutcome: step.expectedOutcome,
              })),
            }}
          />
          <div className="mt-3">
            <DeleteTestCaseButton id={testCase.id} title={testCase.title} />
          </div>
        </div>

        <header className="mt-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Test case #{testCase.id}</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                {testCase.title}
              </h1>
              <p className="mt-2 text-slate-600">{testCase.feature}</p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                {testCase.priority} priority
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {testCase.status}
              </span>
            </div>
          </div>

          <dl className="mt-6 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Preconditions</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-900">
                {testCase.preconditions || "None"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Expected result</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-900">{testCase.expectedResult}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Actual result</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-900">
                {testCase.actualResult || "Not recorded"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Last updated</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-900">
                {testCase.updatedAt.toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </header>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Test steps</h2>
          <ol className="mt-5 space-y-4">
            {testCase.steps.map((step) => (
              <li className="grid gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-[auto_1fr_1fr]" key={step.id}>
                <span className="flex size-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                  {step.position}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Action</p>
                  <p className="mt-1 text-sm leading-6 text-slate-900">{step.action}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected outcome</p>
                  <p className="mt-1 text-sm leading-6 text-slate-900">{step.expectedOutcome}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Linked bugs ({testCase.bugs.length})</h2>
          {testCase.bugs.length > 0 ? (
            <ul className="mt-4 divide-y divide-slate-200">
              {testCase.bugs.map((bug) => (
                <li className="flex items-center justify-between gap-4 py-4" key={bug.id}>
                  <div>
                    <p className="font-medium text-slate-900">{bug.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{bug.severity} severity</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{bug.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No bugs are linked to this test case.</p>
          )}
        </section>
      </div>
    </main>
  );
}
