import { prisma } from "@/lib/prisma";
import { parseId } from "@/lib/validation/id";
import { testCaseResultSchema } from "@/lib/validation/test-case";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
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

  const validation = testCaseResultSchema.safeParse(body);
  if (!validation.success) {
    return Response.json({
      error: "Validation failed",
      details: validation.error.issues.map(({ path, message }) => ({
        path: path.join("."), message,
      })),
    }, { status: 400 });
  }

  try {
    const testCase = await prisma.testCase.update({
      where: { id: testCaseId }, data: validation.data,
    });
    return Response.json(testCase, { status: 200 });
  } catch (error) {
    console.error("Failed to record test result:", error);
    return Response.json({ error: "Failed to record test result" }, { status: 500 });
  }
}
