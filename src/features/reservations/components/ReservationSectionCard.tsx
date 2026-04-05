interface ReservationSectionCardProps {
  eyebrow: string;
  title: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
}

export function ReservationSectionCard({
  eyebrow,
  title,
  description,
  badge,
  children,
}: ReservationSectionCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(15,18,25,0.82)_0%,rgba(10,12,18,0.78)_100%)] px-5 py-5 shadow-[0_16px_34px_rgba(0,0,0,0.18)] backdrop-blur-[14px]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.11),transparent)]" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D4A853]/76">
            {eyebrow}
          </p>
          <h2 className="mt-2.5 font-playfair text-[27px] font-semibold leading-none tracking-[-0.038em] text-[#FCF8F0]">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-white/44">
              {description}
            </p>
          ) : null}
        </div>

        {badge ? (
          <span className="mt-1 shrink-0 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white/38 backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="relative mt-5">
        {children}
      </div>
    </section>
  );
}
