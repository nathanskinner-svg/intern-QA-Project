import { prisma } from "@/lib/prisma";
import { bugCreateSchema } from "@/lib/validation/bug";

export async function GET() {
  try {
    const bugs = await prisma.bug.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(bugs, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve bugs:", error);
    return Response.json({ error: "Failed to retrieve bugs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must contain valid JSON" }, { status: 400 });
  }

  const validation = bugCreateSchema.safeParse(body);
  if (!validation.success) {
    return Response.json({
      error: "Validation failed",
      details: validation.error.issues.map(({ path, message }) => ({
        path: path.join("."), message,
      })),
    }, { status: 400 });
  }

  const { testCaseId, ...bugData } = validation.data;
  try {
    const bug = await prisma.bug.create({
      data: { ...bugData, testCase: { connect: { id: testCaseId } } },
    });
    return Response.json(bug, { status: 201 });
  } catch (error) {
    console.error("Failed to create bug:", error);
    return Response.json({ error: "Failed to create bug" }, { status: 500 });
  }
}
