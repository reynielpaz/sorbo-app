interface ProductSpecialInstructionsProps {
  value: string;
  maxLength: number;
  currentLength: number;
  onChange: (value: string) => void;
}

export function ProductSpecialInstructions({
  value,
  maxLength,
  currentLength,
  onChange,
}: ProductSpecialInstructionsProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.035] bg-[#05070B]/70 px-5 py-5 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
            Instrucciones
          </p>
          <h2 className="mt-2.5 font-playfair text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
            Un detalle final
          </h2>
        </div>

        <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34">
          Opcional
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-[22px] border border-white/[0.04] bg-black/[0.24]">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          maxLength={maxLength}
          placeholder="Ej. término medio, sin cebolla..."
          className="min-h-[96px] w-full resize-none bg-transparent px-4 py-3.5 text-[14px] leading-6 text-white/84 outline-none placeholder:text-white/30"
        />
        <div className="flex items-center justify-end border-t border-white/[0.035] px-4 py-2.5">
          <span className="text-[11px] font-medium tracking-[0.02em] text-white/34">
            {currentLength}/{maxLength}
          </span>
        </div>
      </div>
    </section>
  );
}
