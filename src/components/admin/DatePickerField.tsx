import { useState, useRef, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerFieldProps {
  value: string; // ISO: YYYY-MM-DD
  onChange: (isoValue: string) => void;
  label: string;
}

export function DatePickerField({ value, onChange, label }: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync display value from ISO prop
  useEffect(() => {
    if (value) {
      const parsed = parse(value, 'yyyy-MM-dd', new Date());
      if (isValid(parsed)) {
        setInputValue(format(parsed, 'dd/MM/yyyy'));
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);

    // Auto-insert slashes as user types digits
    // Try to parse complete input
    if (raw.length === 10) {
      const parsed = parse(raw, 'dd/MM/yyyy', new Date());
      if (isValid(parsed)) {
        onChange(format(parsed, 'yyyy-MM-dd'));
        return;
      }
    }

    // Clear ISO value if input is incomplete/invalid
    if (raw === '') {
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Auto-insert slashes after DD and MM
    if (e.key >= '0' && e.key <= '9') {
      const len = inputValue.replace(/[^0-9/]/g, '').length;
      if (len === 2 || len === 5) {
        if (!inputValue.endsWith('/')) {
          setInputValue(prev => prev + '/');
        }
      }
    }
  };

  const handleCalendarSelect = (day: Date | undefined) => {
    if (day) {
      onChange(format(day, 'yyyy-MM-dd'));
      setOpen(false);
    }
  };

  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
  const validSelected = selectedDate && isValid(selectedDate) ? selectedDate : undefined;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-[#0e2e50] ml-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="DD/MM/YYYY"
            maxLength={10}
            className="flex w-full h-14 rounded-2xl bg-white border border-border px-4 pr-12 font-bold text-sm text-foreground placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded hover:bg-secondary/15 transition-colors"
            >
              <CalendarDays size={15} className="text-muted-foreground/50" />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className="w-auto p-0 rounded-2xl border border-border/40 shadow-sm"
          align="start"
          side="bottom"
          sideOffset={6}
          avoidCollisions
          collisionPadding={16}
        >
          <Calendar
            mode="single"
            selected={validSelected}
            onSelect={handleCalendarSelect}
            locale={enGB}
            initialFocus
            className="rounded-2xl"
            classNames={{
              day_selected: 'bg-[#0e2e50]/10 text-[#0e2e50] font-bold hover:bg-[#0e2e50]/15 focus:bg-[#0e2e50]/15',
              day_today: 'bg-muted/60 text-foreground',
              caption_label: 'text-sm font-bold text-[#0e2e50]',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
