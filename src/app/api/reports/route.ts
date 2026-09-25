import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [testCaseTotal, testCasesByStatus, bugTotal, bugsByStatus, bugsBySeverity] =
      await Promise.all([
        prisma.testCase.count(),
        prisma.testCase.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.bug.count(),
        prisma.bug.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.bug.groupBy({ by: ["severity"], _count: { _all: true } }),
      ]);

    return Response.json({
      testCases: {
        total: testCaseTotal,
        byStatus: Object.fromEntries(
          testCasesByStatus.map(({ status, _count }) => [status, _count._all]),
        ),
      },
      bugs: {
        total: bugTotal,
        byStatus: Object.fromEntries(
          bugsByStatus.map(({ status, _count }) => [status, _count._all]),
        ),
        bySeverity: Object.fromEntries(
          bugsBySeverity.map(({ severity, _count }) => [severity, _count._all]),
        ),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve report statistics:", error);
    return Response.json(
      { error: "Failed to retrieve report statistics" },
      { status: 500 },
    );
  }
}
