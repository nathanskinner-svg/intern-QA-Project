"use client";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({ title, description, confirmLabel, isPending = false, error, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <div aria-labelledby="confirm-dialog-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4" role="alertdialog">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900" id="confirm-dialog-title">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        {error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700" role="alert">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" disabled={isPending} onClick={onCancel} type="button">Cancel</button>
          <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} onClick={onConfirm} type="button">
            {isPending ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
