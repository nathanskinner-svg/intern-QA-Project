import { prisma } from "@/lib/prisma";
import { parseId } from "@/lib/validation/id";
import { testCaseCreateSchema } from "@/lib/validation/test-case";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const testCaseId = parseId(id);

  if (testCaseId === null) {
    return Response.json({ error: "Invalid test case ID" }, { status: 400 });
  }

  try {
    const testCase = await prisma.testCase.findUnique({
      where: { id: testCaseId },
      include: { steps: { orderBy: { position: "asc" } } },
    });

    if (!testCase) {
      return Response.json({ error: "Test case not found" }, { status: 404 });
    }

    return Response.json(testCase, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve test case:", error);
    return Response.json({ error: "Failed to retrieve test case" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const testCaseId = parseId((await params).id);
  if (testCaseId === null) {
    return Response.json({ error: "Invalid test case ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must contain valid JSON" }, { status: 400 });
  }

  const validation = testCaseCreateSchema.safeParse(body);
  if (!validation.success) {
    return Response.json({
      error: "Validation failed",
      details: validation.error.issues.map(({ path, message }) => ({
        path: path.join("."), message,
      })),
    }, { status: 400 });
  }

  const { steps, ...testCaseData } = validation.data;
  try {
    const testCase = await prisma.testCase.update({
      where: { id: testCaseId },
      data: { ...testCaseData, steps: { deleteMany: {}, create: steps } },
      include: { steps: { orderBy: { position: "asc" } } },
    });
    return Response.json(testCase, { status: 200 });
  } catch (error) {
    console.error("Failed to update test case:", error);
    return Response.json({ error: "Failed to update test case" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const testCaseId = parseId((await params).id);
  if (testCaseId === null) {
    return Response.json({ error: "Invalid test case ID" }, { status: 400 });
  }

  try {
    await prisma.testCase.delete({ where: { id: testCaseId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete test case:", error);
    return Response.json({ error: "Failed to delete test case" }, { status: 500 });
  }
}
