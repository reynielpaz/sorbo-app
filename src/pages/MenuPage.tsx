import { useEffect } from 'react';
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0)_100%)]" />

        <div className="sticky top-0 z-20 border-b border-white/[0.025] bg-[rgba(5,7,11,0.88)] backdrop-blur-[8px]">
          <div className="relative px-4 pb-3.5 pt-[calc(env(safe-area-inset-top,0px)+10px)]">
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
          className="relative z-[1] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+48px)] pt-3"
        >
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                Explora con calma
              </p>
              <p className="mt-1 text-sm text-white/56">{resultsLine}</p>
            </div>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 rounded-full border border-white/[0.045] bg-black/[0.24] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/68 transition-colors duration-200 hover:border-white/[0.045] hover:text-white"
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
            <div className="space-y-2.5">
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
