import { Minus, Plus } from 'lucide-react';

interface NumericStepperProps {
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  label: string;
}

export function NumericStepper({
  value,
  onChange,
  min = 0,
  max = 20,
  label,
}: NumericStepperProps) {
  const numValue = parseInt(String(value)) || 0;

  const handleDecrement = () => {
    if (numValue > min) {
      onChange((numValue - 1).toString());
    }
  };

  const handleIncrement = () => {
    if (numValue < max) {
      onChange((numValue + 1).toString());
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[#0e2e50] ml-1">{label}</label>
      <div className="flex items-center justify-between h-14 px-4 rounded-2xl bg-secondary/5 border border-border">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={numValue <= min}
          className="flex items-center justify-center w-8 h-8 rounded transition-colors disabled:opacity-30 hover:bg-secondary/20"
        >
          <Minus size={16} className="text-[#0e2e50]" />
        </button>

        <span className="text-lg font-bold text-[#0e2e50] min-w-8 text-center">
          {numValue}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={numValue >= max}
          className="flex items-center justify-center w-8 h-8 rounded transition-colors disabled:opacity-30 hover:bg-secondary/20"
        >
          <Plus size={16} className="text-[#0e2e50]" />
        </button>
      </div>
    </div>
  );
}
