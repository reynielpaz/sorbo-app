import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProductActionBar } from '@/features/product/components/ProductActionBar';
import { ProductCustomizations } from '@/features/product/components/ProductCustomizations';
import { ProductDetailEmptyState } from '@/features/product/components/ProductDetailEmptyState';
import { ProductDetailSkeleton } from '@/features/product/components/ProductDetailSkeleton';
import { ProductHero } from '@/features/product/components/ProductHero';
import { ProductInfoPanel } from '@/features/product/components/ProductInfoPanel';
import { ProductIngredients } from '@/features/product/components/ProductIngredients';
import { useProductDetails } from '@/features/product/hooks/useProductDetails';
import { ROUTES } from '@/utils/constants';

export function ProductPage() {
  const navigate = useNavigate();
  const { product, loading, error, notFound, reload } = useProductDetails();

  function handleBack() {
    const historyIndex = typeof window.history.state?.idx === 'number' ? window.history.state.idx : 0;

    if (historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.MENU);
  }

  function handleGoToMenu() {
    navigate(ROUTES.MENU);
  }

  return (
    <AppShell showHeader={false}>
      <div className="relative min-h-full overflow-x-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-146px] h-[430px] bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.72)_0%,rgba(5,7,12,0.52)_34%,rgba(11,15,26,0.14)_62%,rgba(11,15,26,0)_84%)]" />
        <div className="pointer-events-none absolute inset-x-[-14%] top-[208px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.42)_0%,rgba(11,15,26,0.1)_46%,transparent_74%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-32px] top-[340px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(245,233,212,0.06)_0%,rgba(245,233,212,0.012)_42%,transparent_74%)] blur-3xl" />

        {loading ? <ProductDetailSkeleton /> : null}

        {!loading && error ? (
          <ProductDetailEmptyState
            title="No pudimos abrir este producto"
            description={error}
            onBack={handleGoToMenu}
            onRetry={() => {
              void reload();
            }}
          />
        ) : null}

        {!loading && !error && notFound ? (
          <ProductDetailEmptyState
            title="Este producto ya no está en la carta"
            description="Puede que haya cambiado en el menú o que ya no esté disponible para explorar."
            onBack={handleGoToMenu}
          />
        ) : null}

        {!loading && !error && product ? (
          <>
            <ProductHero product={product} onBack={handleBack} />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative -mt-7 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+132px)]"
            >
              <div className="space-y-4">
                <ProductInfoPanel product={product} />
                <ProductActionBar product={product} />
                <ProductIngredients ingredients={product.ingredients} />
                <ProductCustomizations customizations={product.customizations} />
              </div>
            </motion.div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
