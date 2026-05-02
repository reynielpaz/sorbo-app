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
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const Icon = OCCASION_ICON_MAP[option.value];
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-left transition-[border-color,transform,background-color,color] duration-200 hover:-translate-y-0.5',
              isSelected
                ? 'border-[rgba(212,168,83,0.2)] bg-[#D4A853]/10 text-[#FCF8F0]'
                : 'border-white/[0.05] bg-black/[0.2] text-white/56 hover:border-white/[0.1] hover:text-white/76'
            )}
          >
            <span
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-200',
                isSelected
                  ? 'border-[#D4A853]/14 bg-black/[0.18] text-[#E8C068]'
                  : 'border-white/[0.045] bg-black/[0.18] text-white/44 group-hover:text-white/64'
              )}
            >
              <Icon size={11} />
            </span>

            <span className="text-[12px] font-medium">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
