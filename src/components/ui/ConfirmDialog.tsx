import { Button } from "@/components/ui/Button";


type ConfirmDialogProps = {
  dialog: string;
};

export default function ConfirmDialog({ dialog = "" }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
        <p className="font-semibold text-slate-900">
          {`Are you sure you want to ${dialog}`}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="danger" size="sm">
            No
          </Button>
          <Button variant="primary" size="sm">
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}
