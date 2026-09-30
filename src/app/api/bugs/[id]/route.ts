import { prisma } from "@/lib/prisma";
import { bugCreateSchema } from "@/lib/validation/bug";
import { parseId } from "@/lib/validation/id";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const bugId = parseId((await params).id);
  if (bugId === null) {
    return Response.json({ error: "Invalid bug ID" }, { status: 400 });
  }

  try {
    const bug = await prisma.bug.findUnique({ where: { id: bugId } });
    if (!bug) return Response.json({ error: "Bug not found" }, { status: 404 });
    return Response.json(bug, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve bug:", error);
    return Response.json({ error: "Failed to retrieve bug" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const bugId = parseId((await params).id);
  if (bugId === null) {
    return Response.json({ error: "Invalid bug ID" }, { status: 400 });
  }

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
    const bug = await prisma.bug.update({
      where: { id: bugId },
      data: { ...bugData, testCase: { connect: { id: testCaseId } } },
    });
    return Response.json(bug, { status: 200 });
  } catch (error) {
    console.error("Failed to update bug:", error);
    return Response.json({ error: "Failed to update bug" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const bugId = parseId((await params).id);
  if (bugId === null) {
    return Response.json({ error: "Invalid bug ID" }, { status: 400 });
  }

  try {
    await prisma.bug.delete({ where: { id: bugId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete bug:", error);
    return Response.json({ error: "Failed to delete bug" }, { status: 500 });
  }
}
