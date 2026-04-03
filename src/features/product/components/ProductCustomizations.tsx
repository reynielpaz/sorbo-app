import type { ProductCustomization } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCustomizationsProps {
  customizations?: ProductCustomization[];
}

function buildCustomizationMeta(customization: ProductCustomization) {
  const selectionLabel = customization.type === 'single' ? 'Elige 1' : 'Elige varios';
  return customization.required ? `${selectionLabel} · Obligatorio` : `${selectionLabel} · Opcional`;
}

export function ProductCustomizations({ customizations }: ProductCustomizationsProps) {
  const visibleCustomizations =
    customizations?.filter((customization) => customization.options.length > 0) ?? [];

  if (visibleCustomizations.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(13,16,22,0.98)_0%,rgba(7,9,14,0.98)_100%)] px-5 py-6 shadow-[0_22px_46px_rgba(0,0,0,0.2)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
        Customizaciones
      </p>
      <h2 className="mt-3 font-playfair text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
        Hazlo a tu gusto
      </h2>

      <div className="mt-5 space-y-3.5">
        {visibleCustomizations.map((customization) => (
          <article
            key={customization.id}
            className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(9,12,18,0.74)_100%)] px-4 py-4 shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold text-white/92">
                  {customization.name}
                </h3>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/44">
                  {buildCustomizationMeta(customization)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {customization.options.map((option) => (
                <div
                  key={option.id}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[rgba(255,255,255,0.04)] px-3.5 py-2 text-[12px] text-white/76"
                >
                  <span>{option.label}</span>
                  {typeof option.price === 'number' && option.price > 0 ? (
                    <span className="font-medium text-[#E8D6AD]">
                      +{formatPrice(option.price)}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
