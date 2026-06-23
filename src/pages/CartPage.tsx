import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PageTransition } from '@/components/motion/PageTransition';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { CartItem } from '@/features/cart/types';
import { ROUTES } from '@/utils/constants';
import { formatPrice } from '@/utils/formatPrice';

function formatArticleCount(count: number) {
  return count === 1 ? '1 artículo' : `${count} artículos`;
}

function getCustomizationSummary(item: CartItem) {
  return item.customizations
    .map((customization) => `${customization.groupName}: ${customization.optionName}`)
    .join(' · ');
}

function getAddOnsSummary(item: CartItem) {
  return item.addOns.map((addOn) => addOn.name).join(', ');
}

interface EmptyCartStateProps {
  onGoToMenu: () => void;
}

function EmptyCartState({ onGoToMenu }: EmptyCartStateProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="mt-10 flex min-h-[48vh] flex-col items-center justify-center text-center"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(212,168,83,0.16)] bg-black/[0.28]">
        <ShoppingBag size={24} className="text-[#D4A853]/90" strokeWidth={1.9} />
      </div>
      <h2 className="font-playfair text-[28px] font-semibold leading-tight text-sorbo-cream">
        Tu pedido está vacío
      </h2>
      <p className="mt-2 text-[14px] leading-6 text-white/52">
        Agrega algo rico desde el menú.
      </p>
      <button
        type="button"
        onClick={onGoToMenu}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#120E09] transition-transform duration-200 hover:-translate-y-0.5"
      >
        <UtensilsCrossed size={16} strokeWidth={2.2} />
        Ver menú
      </button>
    </motion.section>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  const customizationSummary = getCustomizationSummary(item);
  const addOnsSummary = getAddOnsSummary(item);

  return (
    <article className="flex gap-3 rounded-[18px] border border-white/[0.035] bg-[#05070B]/72 p-3 shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-20 w-20 flex-none rounded-[15px] object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 flex-none items-center justify-center rounded-[15px] border border-white/[0.035] bg-black/[0.28]">
          <ShoppingBag size={22} className="text-[#D4A853]/62" strokeWidth={1.8} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold leading-5 text-white">
              {item.name}
            </h2>
            {item.categoryName ? (
              <p className="mt-0.5 truncate text-[11px] leading-4 text-white/42">
                {item.categoryName}
              </p>
            ) : null}
          </div>
          <p className="flex-none text-[15px] font-semibold leading-5 text-[#F3D7A0]">
            {formatPrice(item.lineTotal)}
          </p>
        </div>

        <div className="mt-2 space-y-1">
          {customizationSummary ? (
            <p className="truncate text-[11px] leading-4 text-white/52">
              {customizationSummary}
            </p>
          ) : null}
          {addOnsSummary ? (
            <p className="truncate text-[11px] leading-4 text-white/46">
              Adicionales: {addOnsSummary}
            </p>
          ) : null}
          {item.specialInstructions ? (
            <p className="truncate text-[11px] leading-4 text-white/42">
              Nota: {item.specialInstructions}
            </p>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex h-9 items-center rounded-full border border-white/[0.035] bg-black/[0.28] p-1">
            <button
              type="button"
              aria-label={`Reducir cantidad de ${item.name}`}
              onClick={() => onDecrement(item.id)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/58 transition-colors duration-200 hover:bg-white/[0.035] hover:text-white"
            >
              <Minus size={14} strokeWidth={2.2} />
            </button>
            <span className="w-8 text-center text-[13px] font-semibold text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={`Aumentar cantidad de ${item.name}`}
              onClick={() => onIncrement(item.id)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#D4A853] transition-colors duration-200 hover:bg-white/[0.035]"
            >
              <Plus size={14} strokeWidth={2.2} />
            </button>
          </div>

          <button
            type="button"
            aria-label={`Eliminar ${item.name}`}
            onClick={() => onRemove(item.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.035] bg-black/[0.18] text-white/32 transition-colors duration-200 hover:text-[#F3D7A0]"
          >
            <Trash2 size={15} strokeWidth={1.9} />
          </button>
        </div>
      </div>
    </article>
  );
}

interface ClearCartDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

function ClearCartDialog({ onCancel, onConfirm }: ClearCartDialogProps) {
  return (
    <motion.div
      className="fixed inset-0 z-80 flex items-end justify-center bg-black/70 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+18px)] pt-6 sm:items-center sm:pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      role="presentation"
      onClick={onCancel}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-cart-dialog-title"
        className="w-full max-w-[360px] rounded-[24px] border border-white/[0.06] bg-[#05070B] p-5 text-left shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[rgba(212,168,83,0.16)] bg-black/[0.28] text-[#F3D7A0]">
          <Trash2 size={20} strokeWidth={1.9} />
        </div>
        <h2
          id="clear-cart-dialog-title"
          className="mt-4 font-playfair text-[26px] font-semibold leading-tight text-sorbo-cream"
        >
          Vaciar pedido
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-white/54">
          Se eliminarán todos los productos del carrito.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/[0.05] bg-black/[0.28] px-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-white/62 transition-colors duration-200 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(212,168,83,0.18)] bg-black/[0.28] px-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#F3D7A0] transition-colors duration-200 hover:border-[rgba(212,168,83,0.32)] hover:bg-black/[0.36]"
          >
            Vaciar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getItemCount = useCartStore((state) => state.getItemCount);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const hasItems = useCartStore((state) => state.hasItems);
  const [isClearCartDialogOpen, setIsClearCartDialogOpen] = useState(false);

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const cartHasItems = hasItems();

  useEffect(() => {
    if (!isClearCartDialogOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsClearCartDialogOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isClearCartDialogOpen]);

  function handleGoToMenu() {
    navigate(ROUTES.MENU);
  }

  function handleContinue() {
    if (!cartHasItems) {
      return;
    }

    navigate(ROUTES.CHECKOUT);
  }

  function handleClearCart() {
    setIsClearCartDialogOpen(true);
  }

  function handleConfirmClearCart() {
    clearCart();
    setIsClearCartDialogOpen(false);
  }

  return (
    <AppShell showHeader={false} showBottomNav={true} className="bg-[#030406]">
      <PageTransition className="mx-auto flex min-h-full max-w-[720px] flex-col px-4 pb-10 pt-[calc(env(safe-area-inset-top,0px)+24px)]">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex items-start justify-between gap-4"
        >
          <div className="min-w-0">
            <h1 className="font-playfair text-[32px] font-semibold leading-tight text-sorbo-cream">
              Tu pedido
            </h1>
            <p className="mt-1 text-[14px] leading-6 text-white/52">
              Revisa y ajusta antes de continuar.
            </p>
          </div>
          <span className="mt-1 flex-none rounded-full border border-[rgba(212,168,83,0.14)] bg-black/[0.28] px-3 py-1.5 text-[11px] font-semibold text-[#F3D7A0]">
            {formatArticleCount(itemCount)}
          </span>
        </motion.header>

        {cartHasItems ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.04 }}
              className="mt-6 space-y-3"
            >
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onIncrement={incrementItem}
                  onDecrement={decrementItem}
                  onRemove={removeItem}
                />
              ))}
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.08 }}
              className="mt-5 border-t border-white/[0.06] pt-4"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-[14px] font-medium text-white/68">Subtotal</p>
                <p className="text-[22px] font-semibold text-[#F3D7A0]">
                  {formatPrice(subtotal)}
                </p>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-white/42">
                El pago se confirma en el siguiente paso.
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#120E09] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <ArrowRight size={16} strokeWidth={2.2} />
                  Continuar
                </button>
                <button
                  type="button"
                  onClick={handleGoToMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.045] bg-black/[0.28] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/64 transition-colors duration-200 hover:text-[#F3D7A0]"
                >
                  <UtensilsCrossed size={16} strokeWidth={2.1} />
                  Seguir comprando
                </button>
              </div>

              <button
                type="button"
                onClick={handleClearCart}
                className="mt-3 text-[11px] font-medium text-white/34 transition-colors duration-200 hover:text-[#F3D7A0]"
              >
                Vaciar pedido
              </button>
            </motion.section>
          </>
        ) : (
          <EmptyCartState onGoToMenu={handleGoToMenu} />
        )}
      </PageTransition>

      {isClearCartDialogOpen ? (
        <ClearCartDialog
          onCancel={() => setIsClearCartDialogOpen(false)}
          onConfirm={handleConfirmClearCart}
        />
      ) : null}
    </AppShell>
  );
}
