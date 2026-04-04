import { useEffect, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProductAddOns } from '@/features/product/components/ProductAddOns';
import { ProductActionBar } from '@/features/product/components/ProductActionBar';
import { ProductCustomerDetails } from '@/features/product/components/ProductCustomerDetails';
import { ProductCustomizations } from '@/features/product/components/ProductCustomizations';
import { ProductDetailEmptyState } from '@/features/product/components/ProductDetailEmptyState';
import { ProductDetailSkeleton } from '@/features/product/components/ProductDetailSkeleton';
import { ProductHero } from '@/features/product/components/ProductHero';
import { ProductInfoPanel } from '@/features/product/components/ProductInfoPanel';
import { ProductIngredients } from '@/features/product/components/ProductIngredients';
import { ProductPaymentMethodSelector } from '@/features/product/components/ProductPaymentMethodSelector';
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

                    <ProductCustomerDetails
                      customerName={orderComposer.customerName}
                      customerPhone={orderComposer.customerPhone}
                      isNameInvalid={
                        !orderComposer.isCustomerNameValid &&
                        orderComposer.customerName.trim().length > 0
                      }
                      onCustomerNameChange={orderComposer.setCustomerName}
                      onCustomerPhoneChange={orderComposer.setCustomerPhone}
                    />

                    <ProductPaymentMethodSelector
                      selectedPaymentMethod={orderComposer.selectedPaymentMethod}
                      isInvalid={!orderComposer.hasSelectedPaymentMethod}
                      onChange={orderComposer.setSelectedPaymentMethod}
                    />
                  </div>
                </motion.div>

                <ProductActionBar
                  product={currentProduct}
                  quantity={orderComposer.quantity}
                  totalEstimate={orderComposer.totalEstimate}
                  extrasPerUnit={orderComposer.extrasPerUnit}
                  addOnsTotal={orderComposer.addOnsTotal}
                  canSubmit={orderComposer.canSubmit}
                  disabledReason={orderComposer.disabledReason}
                  whatsappHref={orderComposer.whatsappHref}
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
