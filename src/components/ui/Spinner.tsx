type SpinnerProps = {
  label?: string;
};

export default function Spinner({ label = "Loading" }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3" role="status">
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
      />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}
