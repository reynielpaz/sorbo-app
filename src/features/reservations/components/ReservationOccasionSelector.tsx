import { BriefcaseBusiness, Cake, Heart, PenSquare } from 'lucide-react';
import type {
  ReservationOccasion,
  ReservationOccasionOption,
} from '@/features/reservations/hooks/useReservationForm';
import { cn } from '@/utils/cn';

interface ReservationOccasionSelectorProps {
  options: readonly ReservationOccasionOption[];
  value: ReservationOccasion | '';
  onChange: (value: ReservationOccasion) => void;
}

const OCCASION_ICON_MAP = {
  Cumpleaños: Cake,
  Cita: Heart,
  Negocios: BriefcaseBusiness,
  Otro: PenSquare,
} as const;

export function ReservationOccasionSelector({
  options,
  value,
  onChange,
}: ReservationOccasionSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const Icon = OCCASION_ICON_MAP[option.value];
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'group inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2.5 text-left transition-[border-color,transform,background-color,box-shadow,color] duration-200 hover:-translate-y-0.5',
              isSelected
                ? 'border-[rgba(212,168,83,0.22)] bg-[linear-gradient(180deg,rgba(212,168,83,0.12)_0%,rgba(212,168,83,0.05)_100%)] text-[#FCF8F0] shadow-[0_10px_20px_rgba(0,0,0,0.16)]'
                : 'border-white/[0.08] bg-[rgba(255,255,255,0.028)] text-white/64 hover:border-white/[0.12] hover:text-white/80'
            )}
          >
            <span
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-200',
                isSelected
                  ? 'border-[#D4A853]/18 bg-[#D4A853]/12 text-[#E9C982]'
                  : 'border-white/[0.08] bg-white/[0.025] text-white/50 group-hover:text-white/70'
              )}
            >
              <Icon size={15} />
            </span>

            <span className="text-[13px] font-medium">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
