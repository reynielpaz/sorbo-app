import { Check } from 'lucide-react';
import type { ProductCustomization } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCustomizationsProps {
  customizations?: ProductCustomization[];
  selectedOptionsByGroup: Record<string, string[]>;
  missingRequiredGroupIds: string[];
  onToggleOption: (customization: ProductCustomization, optionId: string) => void;
}

function buildCustomizationMeta(customization: ProductCustomization) {
  const selectionLabel = customization.type === 'single' ? 'Elige 1' : 'Elige varios';
  return customization.required ? `${selectionLabel} · Obligatorio` : `${selectionLabel} · Opcional`;
}

export function ProductCustomizations({
  customizations,
  selectedOptionsByGroup,
  missingRequiredGroupIds,
  onToggleOption,
}: ProductCustomizationsProps) {
  const visibleCustomizations =
    customizations?.filter((customization) => customization.options.length > 0) ?? [];
  const missingRequiredSet = new Set(missingRequiredGroupIds);

  if (visibleCustomizations.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.035] bg-[#05070B]/70 px-5 py-5 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
        Customizaciones
      </p>
      <h2 className="mt-3 font-playfair text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
        Hazlo a tu gusto
      </h2>

      <div className="mt-5 space-y-3.5">
        {visibleCustomizations.map((customization) => (
          <fieldset
            key={customization.id}
            className={`rounded-[22px] border px-4 py-4 ${
              missingRequiredSet.has(customization.id)
                ? 'border-[rgba(212,168,83,0.24)] bg-[rgba(212,168,83,0.055)]'
                : 'border-white/[0.04] bg-black/[0.24]'
            }`}
          >
            <legend className="sr-only">{customization.name}</legend>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold text-white/92">
                  {customization.name}
                </h3>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/44">
                  {buildCustomizationMeta(customization)}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                  customization.required
                    ? 'border-[rgba(212,168,83,0.18)] bg-[rgba(212,168,83,0.08)] text-[#E8D6AD]'
                    : 'border-white/[0.04] bg-black/[0.24] text-white/52'
                }`}
              >
                {customization.required ? 'Obligatorio' : 'Opcional'}
              </span>
            </div>

            {missingRequiredSet.has(customization.id) ? (
              <p className="mt-3 text-[12px] leading-5 text-[#E8C068]">
                Selecciona una opción para continuar con tu pedido.
              </p>
            ) : null}

            <div className="mt-4 space-y-2.5">
              {customization.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-[22px] border px-3.5 py-3 transition-[border-color,background,transform,color] duration-200 hover:-translate-y-0.5 ${
                    (selectedOptionsByGroup[customization.id] ?? []).includes(option.id)
                      ? 'border-[rgba(212,168,83,0.34)] bg-[rgba(212,168,83,0.08)] text-white'
                      : 'border-white/[0.04] bg-black/[0.18] text-white/72'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center border ${
                        customization.type === 'single' ? 'rounded-full' : 'rounded-[7px]'
                      } ${
                        (selectedOptionsByGroup[customization.id] ?? []).includes(option.id)
                          ? 'border-[#D4A853] bg-[#D4A853] text-[#140F08]'
                          : 'border-white/[0.16] bg-transparent text-transparent'
                      }`}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>

                    <div className="min-w-0">
                      <input
                        type={customization.type === 'single' ? 'radio' : 'checkbox'}
                        name={customization.id}
                        checked={(selectedOptionsByGroup[customization.id] ?? []).includes(option.id)}
                        onChange={() => onToggleOption(customization, option.id)}
                        className="sr-only"
                      />
                      <p className="text-[13px] font-medium text-current">
                        {option.label}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/32">
                        {customization.type === 'single' ? 'Selección única' : 'Selección múltiple'}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-[12px] font-medium text-[#E8D6AD]">
                    {typeof option.price === 'number' && option.price > 0
                      ? `+${formatPrice(option.price)}`
                      : 'Incluido'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
