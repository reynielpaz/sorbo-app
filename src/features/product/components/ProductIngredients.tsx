interface ProductIngredientsProps {
  ingredients?: string[];
}

export function ProductIngredients({ ingredients }: ProductIngredientsProps) {
  const visibleIngredients = ingredients?.map((ingredient) => ingredient.trim()).filter(Boolean) ?? [];

  if (visibleIngredients.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(13,16,22,0.98)_0%,rgba(7,9,14,0.98)_100%)] px-5 py-6 shadow-[0_22px_46px_rgba(0,0,0,0.2)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
        Ingredientes
      </p>
      <h2 className="mt-3 font-playfair text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
        Lo que lleva
      </h2>
      <p className="mt-3 text-[12px] leading-6 text-white/48">
        Una lectura rápida de la base del producto antes de pedir.
      </p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {visibleIngredients.map((ingredient) => (
          <span
            key={ingredient}
            className="inline-flex rounded-full border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(9,12,18,0.76)_100%)] px-3.5 py-2 text-[12px] text-white/76 shadow-[0_8px_16px_rgba(0,0,0,0.16)]"
          >
            {ingredient}
          </span>
        ))}
      </div>
    </section>
  );
}
