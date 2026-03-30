import type { DiagnosisOption } from '../../types/detective';

interface KioskOptionButtonsProps {
  label: string;
  options: DiagnosisOption[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function KioskOptionButtons({ label, options, selected, onSelect }: KioskOptionButtonsProps) {
  return (
    <div style={{ marginBottom: 6 }}>
      <label className="evidence-form__label" style={{ marginBottom: 4, fontSize: 11 }}>{label}</label>
      {options.map(opt => (
        <button
          key={opt.id}
          className={`kiosk-dd__option-btn ${selected === opt.id ? 'selected' : ''}`}
          onClick={() => onSelect(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
