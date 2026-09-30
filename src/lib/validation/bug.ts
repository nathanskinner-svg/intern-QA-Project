import { z } from "zod";

const text = z.string().trim().min(1, "Required");

export const bugCreateSchema = z.object({
  testCaseId: z.number().int().positive(),
  title: text,
  description: text,
  stepsToReproduce: text,
  expectedBehavior: text,
  actualBehavior: text,
  severity: z.enum(["Low", "Medium", "High", "Critical"]).default("Medium"),
  status: z.enum(["Open", "In Progress", "Resolved", "Closed"])
    .default("Open"),
}).strict();
