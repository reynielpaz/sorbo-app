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
    <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+74px)] z-30 px-4 pt-5">
      <div className="pointer-events-none absolute inset-x-0 bottom-[-14px] h-32 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.5)_38%,rgba(5,7,11,0.94)_100%)]" />

      <section className="relative mx-auto max-w-[720px] overflow-hidden rounded-[26px] border border-white/[0.07] bg-[rgba(11,14,20,0.78)] p-3 shadow-[0_12px_24px_rgba(0,0,0,0.2)] backdrop-blur-[18px]">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]" />

        <div className="relative px-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/28">
              Resumen
            </p>
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/22">
              WhatsApp
            </p>
          </div>

          <p className="mt-1.5 truncate text-[13px] font-medium text-white/72">
            {summaryLabel}
          </p>
          <p aria-live="polite" className="mt-1 text-[11px] leading-5 text-white/36">
            {supportCopy}
          </p>
        </div>

        <button
          type="submit"
          form={formId}
          className={cn(
            'mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-transform duration-200 hover:-translate-y-0.5',
            isValid
              ? 'bg-[linear-gradient(135deg,#EEDDB7_0%,#D4A853_48%,#B78934_100%)] text-[#140F08] shadow-[0_10px_18px_rgba(0,0,0,0.14)]'
              : 'border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(10,13,19,0.88)_100%)] text-white/70'
          )}
        >
          <MessageCircle size={16} strokeWidth={2.2} />
          Reservar por WhatsApp
          <ArrowUpRight size={14} strokeWidth={2.2} />
        </button>
      </section>
    </div>
  );
}
