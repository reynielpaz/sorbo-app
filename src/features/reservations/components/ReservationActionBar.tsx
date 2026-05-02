import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ReservationActionBarProps {
  formId: string;
  isValid: boolean;
  supportCopy: string;
  summaryLabel: string;
}

export function ReservationActionBar({
  formId,
  isValid,
  supportCopy,
  summaryLabel,
}: ReservationActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+74px)] z-30 px-4 pt-2">
      <div className="pointer-events-none absolute inset-x-0 bottom-[-14px] h-24 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.34)_42%,rgba(5,7,11,0.94)_100%)]" />

      <section className="relative mx-auto max-w-[720px] overflow-hidden rounded-[20px] border border-white/[0.04] bg-[#05070B]/92 p-2 shadow-[0_8px_18px_rgba(0,0,0,0.16)]">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.045),transparent)]" />

        <div className="relative px-1 pt-0.5">
          <p className="truncate text-[12px] font-medium text-white/66">
            {summaryLabel}
          </p>
          <p aria-live="polite" className="mt-0.5 truncate text-[10px] leading-4 text-white/30">
            {supportCopy}
          </p>
        </div>

        <button
          type="submit"
          form={formId}
          className={cn(
            'mt-1.5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-transform duration-200 hover:-translate-y-0.5',
            isValid
              ? 'bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] text-[#120E09] shadow-[0_10px_18px_rgba(0,0,0,0.14)]'
              : 'border border-white/[0.05] bg-black/[0.62] text-white/38'
          )}
        >
          <MessageCircle size={15} strokeWidth={2.2} />
          Reservar por WhatsApp
          <ArrowUpRight size={13} strokeWidth={2.2} />
        </button>
      </section>
    </div>
  );
}
