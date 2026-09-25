import { prisma } from "@/lib/prisma";
import { testCaseCreateSchema } from "@/lib/validation/test-case";

export async function GET() {
  try {
    const testCases = await prisma.testCase.findMany({
      include: {
        steps: {
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(testCases);
  } catch (error) {
    console.error("Failed to retrieve test cases:", error);

    return Response.json(
      { error: "Failed to retrieve test cases" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must contain valid JSON" },
      { status: 400 },
    );
  }

  const validation = testCaseCreateSchema.safeParse(body);

  if (!validation.success) {
    return Response.json(
      {
        error: "Validation failed",
        details: validation.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const { steps, ...testCaseData } = validation.data;

  try {
    const testCase = await prisma.testCase.create({
      data: {
        ...testCaseData,
        steps: {
          create: steps,
        },
      },
      include: {
        steps: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return Response.json(testCase, { status: 201 });
  } catch (error) {
    console.error("Failed to create test case:", error);

    return Response.json(
      { error: "Failed to create test case" },
      { status: 500 },
    );
  }
}
