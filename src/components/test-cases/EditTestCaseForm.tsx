"use client";

import { testCaseCreateSchema } from "@/lib/validation/test-case";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";

type EditableStep = {
  key: number;
  action: string;
  expectedOutcome: string;
};

type EditTestCaseFormProps = {
  testCase: {
    id: number;
    title: string;
    feature: string;
    preconditions: string | null;
    expectedResult: string;
    actualResult: string | null;
    priority: string;
    status: string;
    steps: EditableStep[];
  };
};

type ApiError = {
  error?: string;
  details?: { path: string; message: string }[];
};

type FieldErrors = Record<string, string>;

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20";

export default function EditTestCaseForm({ testCase }: EditTestCaseFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<EditableStep[]>(testCase.steps);
  const [nextStepKey, setNextStepKey] = useState(
    Math.max(0, ...testCase.steps.map(({ key }) => key)) + 1,
  );
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function closeForm() {
    setIsOpen(false);
    setSteps(testCase.steps);
    setNextStepKey(Math.max(0, ...testCase.steps.map(({ key }) => key)) + 1);
    setError("");
    setFieldErrors({});
  }

  function addStep() {
    setSteps((current) => [
      ...current,
      { key: nextStepKey, action: "", expectedOutcome: "" },
    ]);
    setNextStepKey((current) => current + 1);
  }

  function removeStep(key: number) {
    setSteps((current) => current.filter((step) => step.key !== key));
  }

  function updateStep(
    key: number,
    field: "action" | "expectedOutcome",
    value: string,
  ) {
    setSteps((current) =>
      current.map((step) =>
        step.key === key ? { ...step, [field]: value } : step,
      ),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const preconditions = String(formData.get("preconditions") ?? "").trim();
    const actualResult = String(formData.get("actualResult") ?? "").trim();
    const payload = {
      title: String(formData.get("title") ?? ""),
      feature: String(formData.get("feature") ?? ""),
      preconditions: preconditions || null,
      expectedResult: String(formData.get("expectedResult") ?? ""),
      actualResult: actualResult || null,
      priority: formData.get("priority"),
      status: formData.get("status"),
      steps: steps.map((step, index) => ({
        position: index + 1,
        action: step.action,
        expectedOutcome: step.expectedOutcome,
      })),
    };
    const validation = testCaseCreateSchema.safeParse(payload);
    if (!validation.success) {
      setFieldErrors(Object.fromEntries(validation.error.issues.map((issue) => [issue.path.join("."), issue.message])));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/test-cases/${testCase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const result = (await response.json()) as ApiError;
        setFieldErrors(Object.fromEntries(result.details?.map(({ path, message }) => [path, message]) ?? []));
        const details = result.details
          ?.map(({ path, message }) => `${path}: ${message}`)
          .join("; ");
        setError(details || result.error || "Failed to update test case");
        return;
      }

      setIsOpen(false);
      router.refresh();
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="flex justify-end">
        <button
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          Edit test case
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">Edit</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Update test case</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update the test details, current result, or verification steps.
          </p>
        </div>
        <button
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          disabled={isSubmitting}
          onClick={closeForm}
          type="button"
        >
          Close
        </button>
      </div>

      <form className="mt-6 space-y-6" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Title
            <input className={inputClasses} defaultValue={testCase.title} name="title" required />
            <FieldError>{fieldErrors.title}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Feature
            <input className={inputClasses} defaultValue={testCase.feature} name="feature" required />
            <FieldError>{fieldErrors.feature}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Preconditions <span className="font-normal text-slate-400">(optional)</span>
            <textarea className={inputClasses} defaultValue={testCase.preconditions ?? ""} name="preconditions" rows={2} />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Expected result
            <textarea className={inputClasses} defaultValue={testCase.expectedResult} name="expectedResult" required rows={2} />
            <FieldError>{fieldErrors.expectedResult}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Actual result <span className="font-normal text-slate-400">(optional)</span>
            <textarea className={inputClasses} defaultValue={testCase.actualResult ?? ""} name="actualResult" rows={2} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Priority
            <select className={inputClasses} defaultValue={testCase.priority} name="priority">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Status
            <select className={inputClasses} defaultValue={testCase.status} name="status">
              <option value="Not Run">Not Run</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
              <option value="Blocked">Blocked</option>
              <option value="Skipped">Skipped</option>
            </select>
          </label>
        </div>

        <fieldset>
          <div className="flex items-center justify-between gap-4">
            <legend className="text-base font-semibold text-slate-900">Test steps</legend>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={addStep} type="button">
              + Add step
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {steps.map((step, index) => (
              <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4 md:grid-cols-[auto_1fr_1fr_auto]" key={step.key}>
                <span className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {index + 1}
                </span>
                <label className="text-sm font-medium text-slate-700">
                  Action
                  <textarea
                    className={inputClasses}
                    onChange={(event) => updateStep(step.key, "action", event.target.value)}
                    required
                    rows={2}
                    value={step.action}
                  />
                  <FieldError>{fieldErrors[`steps.${index}.action`]}</FieldError>
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Expected outcome
                  <textarea
                    className={inputClasses}
                    onChange={(event) => updateStep(step.key, "expectedOutcome", event.target.value)}
                    required
                    rows={2}
                    value={step.expectedOutcome}
                  />
                  <FieldError>{fieldErrors[`steps.${index}.expectedOutcome`]}</FieldError>
                </label>
                <button
                  className="self-start rounded-lg px-2 py-1 text-sm text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-300"
                  disabled={steps.length === 1}
                  onClick={() => removeStep(step.key)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        {error ? (
          <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-3">
          <button className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100" disabled={isSubmitting} onClick={closeForm} type="button">
            Cancel
          </button>
          <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

function FieldError({ children }: { children?: ReactNode }) {
  return children ? <span className="mt-1 block text-xs font-normal text-rose-600">{children}</span> : null;
}
