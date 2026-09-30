"use client";

import { testCaseCreateSchema } from "@/lib/validation/test-case";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { useToast } from "@/components/Toast/ToastService";

type Step = {
  key: number;
  action: string;
  expectedOutcome: string;
};

type ApiError = {
  error?: string;
  details?: { path: string; message: string }[];
};

type FieldErrors = Record<string, string>;

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20";

export default function CreateTestCaseForm() {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { key: 1, action: "", expectedOutcome: "" },
  ]);
  const [nextStepKey, setNextStepKey] = useState(2);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function closeForm() {
    setIsOpen(false);
    setSteps([{ key: 1, action: "", expectedOutcome: "" }]);
    setNextStepKey(2);
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
    const payload = {
      title: String(formData.get("title") ?? ""),
      feature: String(formData.get("feature") ?? ""),
      preconditions: preconditions || null,
      expectedResult: String(formData.get("expectedResult") ?? ""),
      actualResult: null,
      priority: formData.get("priority"),
      status: "Not Run",
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
      const response = await fetch("/api/test-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = (await response.json()) as ApiError & { id?: number };

      if (!response.ok || result.id === undefined) {
        setFieldErrors(Object.fromEntries(result.details?.map(({ path, message }) => [path, message]) ?? []));
        const details = result.details?.map(({ path, message }) => `${path}: ${message}`).join("; ");
        setError(details || result.error || "Failed to create test case");
        toast.open(details || result.error || "Failed to create test case", false);
        return;
      }

      toast.open("Test case created successfully.");
      router.push(`/test-cases/${result.id}`);
      router.refresh();
    } catch {
      setError("Could not connect to the server. Please try again.");
      toast.open("Could not connect to the server. Please try again.", false);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="flex justify-end">
        <button
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          + Create test case
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">Create</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">New test case</h1>
          <p className="mt-1 text-sm text-slate-500">
            Define what to test, the expected result, and the steps to verify it.
          </p>
        </div>
        <button
          aria-label="Close create test case form"
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
            <input className={inputClasses} name="title" placeholder="User can sign in" required />
            <FieldError>{fieldErrors.title}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Feature
            <input className={inputClasses} name="feature" placeholder="Authentication" required />
            <FieldError>{fieldErrors.feature}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Preconditions <span className="font-normal text-slate-400">(optional)</span>
            <textarea className={inputClasses} name="preconditions" placeholder="A verified user account exists" rows={2} />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Expected result
            <textarea className={inputClasses} name="expectedResult" placeholder="The user reaches the dashboard" required rows={2} />
            <FieldError>{fieldErrors.expectedResult}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Priority
            <select className={inputClasses} defaultValue="Medium" name="priority">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
          <div className="text-sm font-medium text-slate-700">
            Initial status
            <div className="mt-1.5 flex min-h-10 items-center rounded-lg bg-slate-50 px-3 text-sm font-normal text-slate-500">
              Not Run
            </div>
          </div>
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
                    placeholder="Open the sign-in page"
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
                    placeholder="The sign-in form is visible"
                    required
                    rows={2}
                    value={step.expectedOutcome}
                  />
                  <FieldError>{fieldErrors[`steps.${index}.expectedOutcome`]}</FieldError>
                </label>
                <button
                  aria-label={`Remove step ${index + 1}`}
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

        <div className="flex justify-end">
          <button
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating…" : "Create test case"}
          </button>
        </div>
      </form>
    </section>
  );
}

function FieldError({ children }: { children?: ReactNode }) {
  return children ? <span className="mt-1 block text-xs font-normal text-rose-600">{children}</span> : null;
}
