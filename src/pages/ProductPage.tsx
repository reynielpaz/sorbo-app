import { useEffect, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProductAddOns } from '@/features/product/components/ProductAddOns';
import { ProductActionBar } from '@/features/product/components/ProductActionBar';
import { ProductCustomizations } from '@/features/product/components/ProductCustomizations';
import { ProductDetailEmptyState } from '@/features/product/components/ProductDetailEmptyState';
import { ProductDetailSkeleton } from '@/features/product/components/ProductDetailSkeleton';
import { ProductHero } from '@/features/product/components/ProductHero';
import { ProductInfoPanel } from '@/features/product/components/ProductInfoPanel';
import { ProductIngredients } from '@/features/product/components/ProductIngredients';
import { useProductDetails } from '@/features/product/hooks/useProductDetails';
import { useProductOrderComposer } from '@/features/product/hooks/useProductOrderComposer';
import { ProductSpecialInstructions } from '@/features/product/components/ProductSpecialInstructions';
import { getProductAddOns } from '@/services/products';
import type { Product } from '@/types';
import { ROUTES } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';

export function ProductPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { productId, product, snapshotProduct, loading, error, notFound, reload } = useProductDetails();
  const currentProduct = productId && product?.id === productId ? product : null;
  const heroProduct = !error && !notFound ? currentProduct ?? (loading ? snapshotProduct : null) : null;
  const [availableAddOns, setAvailableAddOns] = useState<Product[]>([]);
  const [addOnsLoading, setAddOnsLoading] = useState(false);
  const [orderDraftFeedbackVisible, setOrderDraftFeedbackVisible] = useState(false);
  const orderComposer = useProductOrderComposer(currentProduct, {
    initialCustomerName: profile?.fullName,
    initialCustomerPhone: profile?.phone,
    availableAddOns,
  });

  useLayoutEffect(() => {
    if (!productId) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    const mainElement = document.querySelector('main');

    if (mainElement instanceof HTMLElement) {
      mainElement.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [productId]);

  useEffect(() => {
    let isCancelled = false;

    if (!currentProduct) {
      setAvailableAddOns([]);
      setAddOnsLoading(false);
      return;
    }

    setAddOnsLoading(true);

    void getProductAddOns(currentProduct.id)
      .then((nextAddOns) => {
        if (!isCancelled) {
          setAvailableAddOns(nextAddOns);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setAvailableAddOns([]);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setAddOnsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [currentProduct]);

  useEffect(() => {
    if (!orderDraftFeedbackVisible) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setOrderDraftFeedbackVisible(false);
    }, 3600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [orderDraftFeedbackVisible]);

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

  function handleAddToOrder() {
    if (!orderComposer.productOrderDraft) {
      return;
    }

    setOrderDraftFeedbackVisible(true);
  }

  return (
    <AppShell showHeader={false} showBottomNav={false}>
      <div className="relative min-h-full overflow-x-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-146px] h-[430px] bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.72)_0%,rgba(5,7,12,0.52)_34%,rgba(11,15,26,0.14)_62%,rgba(11,15,26,0)_84%)]" />
        <div className="pointer-events-none absolute inset-x-[-14%] top-[208px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.42)_0%,rgba(11,15,26,0.1)_46%,transparent_74%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-32px] top-[340px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(245,233,212,0.06)_0%,rgba(245,233,212,0.012)_42%,transparent_74%)] blur-3xl" />

        {loading && !heroProduct ? <ProductDetailSkeleton /> : null}

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

        {heroProduct ? (
          <>
            <ProductHero product={heroProduct} onBack={handleBack} />

            {!loading && !error && currentProduct ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative -mt-3 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+280px)]"
                >
                  <div className="mx-auto max-w-[720px] space-y-6">
                    <ProductInfoPanel product={currentProduct} />
                    <ProductIngredients ingredients={currentProduct.ingredients} />

                    <ProductCustomizations
                      customizations={currentProduct.customizations}
                      selectedOptionsByGroup={orderComposer.selectedOptionsByGroup}
                      missingRequiredGroupIds={orderComposer.missingRequiredGroupIds}
                      onToggleOption={orderComposer.toggleOption}
                    />

                    <ProductSpecialInstructions
                      value={orderComposer.specialInstructions}
                      maxLength={orderComposer.specialInstructionsLimit}
                      currentLength={orderComposer.specialInstructionsCount}
                      onChange={orderComposer.setSpecialInstructions}
                    />

                    <ProductAddOns
                      products={availableAddOns}
                      selectedAddOnIds={orderComposer.selectedAddOnIds}
                      loading={addOnsLoading}
                      onToggleAddOn={orderComposer.toggleAddOn}
                    />
                  </div>
                </motion.div>

                {orderDraftFeedbackVisible ? (
                  <motion.div
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+238px)] z-40 px-4"
                  >
                    <div className="mx-auto max-w-[720px] rounded-[24px] border border-[rgba(212,168,83,0.22)] bg-[linear-gradient(180deg,rgba(18,21,29,0.98)_0%,rgba(8,10,15,0.98)_100%)] px-4 py-3 text-[12px] font-medium leading-5 text-[#F3D7A0] shadow-[0_18px_34px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
                      Producto preparado para el pedido. El carrito se activará en la siguiente fase.
                    </div>
                  </motion.div>
                ) : null}

                <ProductActionBar
                  product={currentProduct}
                  quantity={orderComposer.quantity}
                  totalEstimate={orderComposer.totalEstimate}
                  extrasPerUnit={orderComposer.extrasPerUnit}
                  addOnsTotal={orderComposer.addOnsTotal}
                  canSubmit={orderComposer.canSubmit}
                  disabledReason={orderComposer.disabledReason}
                  onAddToOrder={handleAddToOrder}
                  onDecreaseQuantity={orderComposer.decrementQuantity}
                  onIncreaseQuantity={orderComposer.incrementQuantity}
                />
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
