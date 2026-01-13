// src/components/epiconnect/EpiProgressCard.tsx
// Challenge progress summary card for EpiConnect

interface EpiProgressCardProps {
  completed: number;
  total: number;
  points: number;
}

export function EpiProgressCard({ completed, total, points }: EpiProgressCardProps) {
  const percentage = (completed / total) * 100;

  return (
    <div className="epi-progressCard">
      <div className="epi-progressCard__row">
        <div>
          <div className="epi-progressCard__label">Challenge Progress</div>
          <div className="epi-progressCard__value">{completed} / {total}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="epi-progressCard__label">Total Points</div>
          <div className="epi-progressCard__value">{points}</div>
        </div>
      </div>
      <div className="epi-progressCard__bar">
        <div
          className="epi-progressCard__barFill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default EpiProgressCard;
