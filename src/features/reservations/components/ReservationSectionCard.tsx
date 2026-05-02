interface ReservationSectionCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: string;
  allowOverflow?: boolean;
  children: React.ReactNode;
}

export function ReservationSectionCard({
  eyebrow,
  title,
  description,
  badge,
  allowOverflow = false,
  children,
}: ReservationSectionCardProps) {
  return (
    <section
      className={`relative rounded-[22px] border border-white/[0.035] bg-[#05070B]/58 p-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)] backdrop-blur-[4px] ${
        allowOverflow ? 'overflow-visible' : 'overflow-hidden'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.045),transparent)]" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#D4A853]/74">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={`font-playfair text-[22px] font-semibold leading-none text-[#FCF8F0] ${
              eyebrow ? 'mt-1.5' : ''
            }`}
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 max-w-[300px] text-[12px] leading-5 text-white/34">
              {description}
            </p>
          ) : null}
        </div>

        {badge ? (
          <span className="mt-0.5 shrink-0 rounded-full border border-white/[0.04] bg-black/[0.18] px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] text-white/30">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="relative mt-3.5">
        {children}
      </div>
    </section>
  );
}
