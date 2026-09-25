import { z } from "zod";

const text = z.string().trim().min(1, "Required");

const testStepCreateSchema = z.object({
  position: z.number().int().positive(),
  action: text,
  expectedOutcome: text,
}).strict();

const stepsSchema = z
  .array(testStepCreateSchema)
  .min(1, "At least one test step is required")
  .refine(
    (steps) => new Set(steps.map((step) => step.position)).size === steps.length,
    "Step positions must be unique",
  );

export const testCaseCreateSchema = z.object({
  title: text,
  feature: text,
  preconditions: text.nullish(),
  steps: stepsSchema,
  expectedResult: text,
  actualResult: text.nullish(),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  status: z.enum(["Not Run", "Pass", "Fail", "Blocked", "Skipped"])
    .default("Not Run"),
}).strict();

export const testCaseResultSchema = z.object({
  status: z.enum(["Pass", "Fail", "Blocked", "Skipped"]),
  actualResult: text,
}).strict();
