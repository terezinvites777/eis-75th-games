// src/components/epiconnect/EpiLedgerRow.tsx
// Challenge ledger row for EpiConnect

interface EpiLedgerRowProps {
  icon: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  target: number;
  isComplete: boolean;
}

export function EpiLedgerRow({
  icon,
  title,
  description,
  points,
  progress,
  target,
  isComplete,
}: EpiLedgerRowProps) {
  const percentage = Math.min(100, (progress / target) * 100);

  return (
    <div className={`epi-ledgerRow ${isComplete ? 'is-complete' : ''}`}>
      <div className="epi-ledgerRow__icon">{icon}</div>
      <div className="epi-ledgerRow__content">
        <div className="epi-ledgerRow__title">{title}</div>
        <div className="epi-ledgerRow__desc">{description}</div>
        {target > 1 && (
          <div className="epi-ledgerRow__progress">
            <div
              className="epi-ledgerRow__progressFill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
      <div className="epi-ledgerRow__points">
        {isComplete ? `+${points}` : `${progress}/${target}`}
      </div>
    </div>
  );
}

export default EpiLedgerRow;
