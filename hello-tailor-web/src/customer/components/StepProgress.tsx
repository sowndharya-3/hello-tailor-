export default function StepProgress({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between text-[12px] text-ht-text-secondary">
        <span>Step {step} of {total}</span>
        <span>{label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ht-disabled-bg">
        <div className="h-full rounded-full bg-ht-ocean transition-all" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}
