import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { MenuCategoryRail } from '@/features/menu/components/MenuCategoryRail';
import { MenuEmptyState } from '@/features/menu/components/MenuEmptyState';
import { MenuProductCard } from '@/features/menu/components/MenuProductCard';
import { MenuProductListSkeleton } from '@/features/menu/components/MenuProductListSkeleton';
import { MenuSearchBar } from '@/features/menu/components/MenuSearchBar';
import { MenuTopBar } from '@/features/menu/components/MenuTopBar';
import { useMenuProducts } from '@/features/menu/hooks/useMenuProducts';
import { ROUTES } from '@/utils/constants';

function buildSubtitle(options: {
  totalProducts: number;
  resultsCount: number;
  categoryName?: string;
  searchQuery: string;
}) {
  const searchQuery = options.searchQuery.trim();

  if (searchQuery && options.categoryName) {
    return `${options.resultsCount} hallazgos en ${options.categoryName} para "${searchQuery}".`;
  }

  if (searchQuery) {
    return `${options.resultsCount} hallazgos para "${searchQuery}" en la carta completa.`;
  }

  if (options.categoryName) {
    return `${options.resultsCount} opciones disponibles en ${options.categoryName}.`;
  }

  return `${options.totalProducts} productos disponibles para explorar a tu ritmo.`;
}

function buildResultsLine(options: {
  resultsCount: number;
  categoryName?: string;
  searchQuery: string;
}) {
  const searchQuery = options.searchQuery.trim();

  if (searchQuery && options.categoryName) {
    return `${options.resultsCount} resultados en ${options.categoryName}`;
  }

  if (searchQuery) {
    return `${options.resultsCount} resultados para tu búsqueda`;
  }

  if (options.categoryName) {
    return `${options.resultsCount} disponibles en ${options.categoryName}`;
  }

  return `${options.resultsCount} disponibles ahora`;
}

export function MenuPage() {
  const navigate = useNavigate();
  const {
    categories,
    filteredProducts,
    activeCategory,
    activeCategorySlug,
    searchQuery,
    loading,
    error,
    totalProducts,
    resultsCount,
    hasActiveFilters,
    countsByCategory,
    setActiveCategory,
    setSearchQuery,
    clearSearch,
    clearFilters,
    reload,
  } = useMenuProducts();

  const categoryName = activeCategory?.name;
  const subtitle = buildSubtitle({
    totalProducts,
    resultsCount,
    categoryName,
    searchQuery,
  });
  const resultsLine = buildResultsLine({
    resultsCount,
    categoryName,
    searchQuery,
  });

  function handleBack() {
    const historyIndex = typeof window.history.state?.idx === 'number' ? window.history.state.idx : 0;

    if (historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.HOME);
  }

  function handleRetry() {
    void reload();
  }

  return (
    <AppShell showHeader={false}>
      <div className="relative min-h-full overflow-x-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-132px] h-[380px] bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.68)_0%,rgba(5,7,12,0.56)_28%,rgba(11,15,26,0.16)_56%,rgba(11,15,26,0)_78%)]" />
        <div className="pointer-events-none absolute inset-x-[-12%] top-[34px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.42)_0%,rgba(11,15,26,0.12)_48%,transparent_76%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-18px] top-[56px] h-[132px] w-[132px] rounded-full bg-[radial-gradient(circle,rgba(245,233,212,0.06)_0%,rgba(245,233,212,0.015)_34%,transparent_74%)] blur-2xl" />

        <div className="sticky top-0 z-20 border-b border-white/[0.035] bg-[linear-gradient(180deg,rgba(6,8,13,0.86)_0%,rgba(10,13,20,0.8)_58%,rgba(11,15,26,0.08)_100%)] backdrop-blur-[18px]">
          <div className="relative px-4 pb-3.5 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
            <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />
            <div className="space-y-2.5">
              <MenuTopBar
                onBack={handleBack}
                subtitle={subtitle}
                resultsValue={loading ? '...' : String(resultsCount)}
              />

              <MenuSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={clearSearch}
              />

              <MenuCategoryRail
                categories={categories}
                activeCategorySlug={activeCategorySlug}
                countsByCategory={countsByCategory}
                totalCount={totalProducts}
                onSelect={setActiveCategory}
              />
            </div>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-[1] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+56px)] pt-3.5"
        >
          <div className="mb-4 flex items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D4A853]/78">
                Explora con calma
              </p>
              <p className="mt-1 text-sm text-white/56">{resultsLine}</p>
            </div>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/68 transition-colors duration-200 hover:border-[rgba(212,168,83,0.18)] hover:text-white"
              >
                Limpiar
              </button>
            ) : null}
          </div>

          {loading ? <MenuProductListSkeleton /> : null}

          {!loading && error ? (
            <MenuEmptyState
              tone="error"
              title="La carta no respondió"
              description="No pudimos traer el menú completo en este momento. Intenta otra vez en un instante."
              actionLabel="Reintentar"
              onAction={handleRetry}
            />
          ) : null}

          {!loading && !error && filteredProducts.length === 0 ? (
            <MenuEmptyState
              title="Nada cruza con ese antojo"
              description={
                hasActiveFilters
                  ? 'Prueba otra búsqueda o limpia el filtro para volver a recorrer la carta completa.'
                  : 'Todavía no tenemos productos visibles en este momento.'
              }
              actionLabel={hasActiveFilters ? 'Limpiar filtros' : 'Volver al inicio'}
              onAction={hasActiveFilters ? clearFilters : handleBack}
            />
          ) : null}

          {!loading && !error && filteredProducts.length > 0 ? (
            <div className="space-y-3">
              {filteredProducts.map((product, index) => (
                <MenuProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : null}
        </motion.section>
      </div>
    </AppShell>
  );
}
