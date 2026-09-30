"use client";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/Toast/ToastService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTestCaseButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const toast = useToast();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteTestCase() {
    setIsDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/test-cases/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        const message = result.error || "Failed to delete test case";
        setError(message);
        toast.open(message, false);
        return;
      }
      toast.open(`“${title}” was deleted successfully.`);
      router.push("/test-cases");
      router.refresh();
    } catch {
      const message = "Could not connect to the server. Please try again.";
      setError(message);
      toast.open(message, false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <button className="rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-50" onClick={() => setIsConfirming(true)} type="button">Delete test case</button>
      </div>
      {isConfirming ? (
        <ConfirmDialog
          confirmLabel="Delete test case"
          description={`“${title}” and all of its steps will be permanently deleted. Linked bugs will also be deleted.`}
          error={error}
          isPending={isDeleting}
          onCancel={() => { setIsConfirming(false); setError(""); }}
          onConfirm={deleteTestCase}
          title="Delete this test case?"
        />
      ) : null}
    </>
  );
}
