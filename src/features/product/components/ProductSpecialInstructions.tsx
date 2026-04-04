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
    <section className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(13,16,22,0.98)_0%,rgba(7,9,14,0.98)_100%)] px-5 py-6 shadow-[0_22px_46px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
            Instrucciones
          </p>
          <h2 className="mt-3 font-playfair text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
            Un detalle final
          </h2>
        </div>

        <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34">
          Opcional
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_0%,rgba(9,12,18,0.76)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          maxLength={maxLength}
          placeholder="Ej. término medio, sin cebolla..."
          className="min-h-[128px] w-full resize-none bg-transparent px-4 py-4 text-[14px] leading-7 text-white/84 outline-none placeholder:text-white/30"
        />
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
          <p className="text-[11px] leading-5 text-white/42">
            Si queda vacío, no se incluirá en el pedido.
          </p>
          <span className="text-[11px] font-medium tracking-[0.02em] text-white/34">
            {currentLength}/{maxLength}
          </span>
        </div>
      </div>
    </section>
  );
}
