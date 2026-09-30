"use client";

import { bugCreateSchema } from "@/lib/validation/bug";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useRef, useState } from "react";

type CreateBugFormProps = {
  testCases: { id: number; title: string }[];
};

type FieldErrors = Record<string, string>;

const inputClasses =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20";

export default function CreateBugForm({ testCases }: CreateBugFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function closeForm() {
    setIsOpen(false);
    setError("");
    setFieldErrors({});
    formRef.current?.reset();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      testCaseId: Number(formData.get("testCaseId")),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      stepsToReproduce: String(formData.get("stepsToReproduce") ?? ""),
      expectedBehavior: String(formData.get("expectedBehavior") ?? ""),
      actualBehavior: String(formData.get("actualBehavior") ?? ""),
      severity: formData.get("severity"),
      status: formData.get("status"),
    };
    const validation = bugCreateSchema.safeParse(payload);

    if (!validation.success) {
      setFieldErrors(Object.fromEntries(validation.error.issues.map((issue) => [issue.path.join("."), issue.message])));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = (await response.json()) as {
        id?: number;
        error?: string;
        details?: { path: string; message: string }[];
      };

      if (!response.ok || result.id === undefined) {
        setFieldErrors(Object.fromEntries(result.details?.map(({ path, message }) => [path, message]) ?? []));
        setError(result.error || "Failed to create bug");
        return;
      }

      closeForm();
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
        <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={testCases.length === 0} onClick={() => setIsOpen(true)} type="button">
          + Create bug
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">Create</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Report a bug</h1>
          <p className="mt-1 text-sm text-slate-500">Describe the issue and connect it to the test case that exposed it.</p>
        </div>
        <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" disabled={isSubmitting} onClick={closeForm} type="button">Close</button>
      </div>

      <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit} ref={formRef}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Title
            <input className={inputClasses} name="title" placeholder="Checkout total excludes shipping" />
            <FieldError>{fieldErrors.title}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Related test case
            <select className={inputClasses} defaultValue="" name="testCaseId">
              <option disabled value="">Select a test case</option>
              {testCases.map((testCase) => <option key={testCase.id} value={testCase.id}>{testCase.title}</option>)}
            </select>
            <FieldError>{fieldErrors.testCaseId}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Description
            <textarea className={inputClasses} name="description" placeholder="Summarize what is wrong and its impact" rows={3} />
            <FieldError>{fieldErrors.description}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Steps to reproduce
            <textarea className={inputClasses} name="stepsToReproduce" placeholder="1. Add an item to the cart..." rows={4} />
            <FieldError>{fieldErrors.stepsToReproduce}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Expected behavior
            <textarea className={inputClasses} name="expectedBehavior" placeholder="What should happen" rows={3} />
            <FieldError>{fieldErrors.expectedBehavior}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Actual behavior
            <textarea className={inputClasses} name="actualBehavior" placeholder="What happened instead" rows={3} />
            <FieldError>{fieldErrors.actualBehavior}</FieldError>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Severity
            <select className={inputClasses} defaultValue="Medium" name="severity">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Status
            <select className={inputClasses} defaultValue="Open" name="status">
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </label>
        </div>

        {error ? <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p> : null}

        <div className="flex justify-end gap-3">
          <button className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100" disabled={isSubmitting} onClick={closeForm} type="button">Cancel</button>
          <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating..." : "Create bug"}
          </button>
        </div>
      </form>
    </section>
  );
}

function FieldError({ children }: { children?: ReactNode }) {
  return children ? <span className="mt-1 block text-xs font-normal text-rose-600">{children}</span> : null;
}
