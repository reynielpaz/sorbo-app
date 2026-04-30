interface ProductIngredientsProps {
  ingredients?: string[];
}

export function ProductIngredients({ ingredients }: ProductIngredientsProps) {
  const visibleIngredients = ingredients?.map((ingredient) => ingredient.trim()).filter(Boolean) ?? [];

  if (visibleIngredients.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.035] bg-[#05070B]/70 px-5 py-5 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
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
            className="inline-flex rounded-full border border-white/[0.04] bg-black/[0.24] px-3.5 py-2 text-[12px] text-white/74"
          >
            {ingredient}
          </span>
        ))}
      </div>
    </section>
  );
}
