import { z } from "zod";

const text = z.string().trim().min(1, "Required");

export const bugCreateSchema = z.object({
  testCaseId: z.number().int().positive(),
  title: text,
  description: text,
  stepsToReproduce: text,
  expectedBehavior: text,
  actualBehavior: text,
  severity: z.enum(["Low", "Medium", "High"]).default("Medium"),
  status: z.enum(["Not Run", "Pass", "Fail", "Blocked", "Skipped"])
    .default("Not Run"),
}).strict();
