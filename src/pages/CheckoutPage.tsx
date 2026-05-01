import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Banknote,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleDollarSign,
  CreditCard,
  Send,
  ShoppingBag,
  Smartphone,
  UtensilsCrossed,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { createOrder } from '@/services/orders';
import type { OrderType } from '@/types/order';
import {
  PAYMENT_METHODS,
  ROUTES,
  VENEZUELAN_MOBILE_PREFIXES,
  WHATSAPP_NUMBER,
  type PaymentMethodId,
} from '@/utils/constants';
import { formatPrice } from '@/utils/formatPrice';

const FEEDBACK_TIMEOUT = 3200;
const ORDER_TYPES: Array<{ id: OrderType; label: string }> = [
  { id: 'takeout', label: 'Retirar' },
  { id: 'dine_in', label: 'Comer en local' },
];
const DEFAULT_PHONE_PREFIX = VENEZUELAN_MOBILE_PREFIXES[0].value;

type VenezuelanMobilePrefix = (typeof VENEZUELAN_MOBILE_PREFIXES)[number]['value'];

function formatArticleCount(count: number) {
  return count === 1 ? '1 artículo' : `${count} artículos`;
}

function formatTicketDatePart(value: number) {
  return value.toString().padStart(2, '0');
}

function generateTemporaryOrderTicket() {
  const now = new Date();
  const year = now.getFullYear();
  const month = formatTicketDatePart(now.getMonth() + 1);
  const day = formatTicketDatePart(now.getDate());
  const hours = formatTicketDatePart(now.getHours());
  const minutes = formatTicketDatePart(now.getMinutes());
  const randomCode = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, '0');

  return `SB-${year}${month}${day}-${hours}${minutes}-${randomCode}`;
}

function isVenezuelanMobilePrefix(value: string): value is VenezuelanMobilePrefix {
  return VENEZUELAN_MOBILE_PREFIXES.some((prefix) => prefix.value === value);
}

function normalizeProfilePhoneDigits(value: string) {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('58') && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  }

  return digits;
}

function sanitizeLocalPhoneNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 7);
}

function parseProfilePhone(value?: string | null) {
  const phone = normalizeProfilePhoneDigits(value ?? '');
  const prefix = phone.slice(0, 4);
  const localNumber = phone.slice(4);

  if (phone.length !== 11 || !isVenezuelanMobilePrefix(prefix) || localNumber.length !== 7) {
    return { prefix: null, localNumber: '' };
  }

  return { prefix, localNumber };
}

function getPaymentIcon(methodId: PaymentMethodId) {
  if (methodId === 'pago_movil') return Smartphone;
  if (methodId === 'tarjeta') return CreditCard;
  if (methodId === 'binance') return CircleDollarSign;
  if (methodId === 'zelle') return Send;
  if (methodId === 'efectivo') return Banknote;
  return CircleDollarSign;
}

interface EmptyCheckoutStateProps {
  onGoToMenu: () => void;
}

interface SubmittedCheckoutStateProps {
  ticket: string;
  total: number | null;
  feedbackMessage: string | null;
  onReopenWhatsapp: () => void;
  onNewOrder: () => void;
  onGoHome: () => void;
}

function EmptyCheckoutState({ onGoToMenu }: EmptyCheckoutStateProps) {
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
        No hay productos en tu pedido
      </h2>
      <p className="mt-2 max-w-[300px] text-[14px] leading-6 text-white/52">
        Agrega algo desde el menú antes de continuar.
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

function SubmittedCheckoutState({
  ticket,
  total,
  feedbackMessage,
  onReopenWhatsapp,
  onNewOrder,
  onGoHome,
}: SubmittedCheckoutStateProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="mt-8 rounded-[22px] border border-[rgba(212,168,83,0.16)] bg-[#05070B]/72 p-5 text-center shadow-[0_18px_42px_rgba(0,0,0,0.26)]"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(212,168,83,0.18)] bg-black/[0.28] text-[#F3D7A0]">
        <Check size={24} strokeWidth={2.2} />
      </div>

      <h2 className="mt-5 font-playfair text-[30px] font-semibold leading-tight text-sorbo-cream">
        Pedido enviado
      </h2>
      <p className="mx-auto mt-2 max-w-[320px] text-[14px] leading-6 text-white/54">
        Tu pedido fue registrado correctamente.
      </p>

      <div className="mt-5 space-y-1.5">
        <p className="text-[13px] font-semibold text-[#F3D7A0]">Ticket: {ticket}</p>
        {total !== null ? (
          <p className="text-[13px] font-medium text-white/58">Total: {formatPrice(total)}</p>
        ) : null}
      </div>

      <p className="mx-auto mt-4 max-w-[310px] text-[12px] leading-5 text-white/42">
        Si necesitas revisar el mensaje, puedes reabrir WhatsApp.
      </p>

      {feedbackMessage ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-full border border-[rgba(212,168,83,0.16)] bg-black/[0.28] px-4 py-2 text-center text-[12px] font-medium text-[#F3D7A0]"
        >
          {feedbackMessage}
        </p>
      ) : null}

      <div className="mt-5 space-y-2.5">
        <button
          type="button"
          onClick={onReopenWhatsapp}
          className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#120E09] transition-transform duration-200 hover:-translate-y-0.5"
        >
          Reabrir WhatsApp
        </button>
        <button
          type="button"
          onClick={onNewOrder}
          className="inline-flex w-full items-center justify-center rounded-full border border-white/[0.05] bg-black/[0.28] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/64 transition-colors duration-200 hover:text-[#F3D7A0]"
        >
          Hacer otro pedido
        </button>
        <button
          type="button"
          onClick={onGoHome}
          className="inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/42 transition-colors duration-200 hover:text-white/64"
        >
          Ir al inicio
        </button>
      </div>
    </motion.section>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const profilePhone = parseProfilePhone(profile?.phone);
  const items = useCartStore((state) => state.items);
  const getItemCount = useCartStore((state) => state.getItemCount);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const hasItems = useCartStore((state) => state.hasItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const [customerName, setCustomerName] = useState(profile?.fullName?.trim() ?? '');
  const [phonePrefix, setPhonePrefix] = useState<VenezuelanMobilePrefix>(
    profilePhone.prefix ?? DEFAULT_PHONE_PREFIX,
  );
  const [phoneLocalNumber, setPhoneLocalNumber] = useState(profilePhone.localNumber);
  const [isPhonePrefixOpen, setIsPhonePrefixOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('takeout');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId | null>(null);
  const [notes, setNotes] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string | null>(null);
  const [submittedTotal, setSubmittedTotal] = useState<number | null>(null);

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const cartHasItems = hasItems();
  const visibleItems = useMemo(() => items.slice(0, 3), [items]);
  const hiddenItemCount = Math.max(0, items.length - visibleItems.length);
  const customerPhone = `${phonePrefix}${phoneLocalNumber}`;
  const isPhonePrefixAllowed = isVenezuelanMobilePrefix(phonePrefix);
  const isPhoneValid =
    isPhonePrefixAllowed && phoneLocalNumber.length === 7 && customerPhone.length === 11;
  const shouldShowPhoneError = phoneLocalNumber.length > 0 && !isPhoneValid;
  const canPrepareOrder =
    cartHasItems &&
    customerName.trim().length > 0 &&
    isPhoneValid &&
    selectedPaymentMethod !== null;
  const isSubmitDisabled = !canPrepareOrder || isSubmitting;

  useEffect(() => {
    const parsedPhone = parseProfilePhone(profile?.phone);

    setCustomerName((currentValue) => currentValue || profile?.fullName?.trim() || '');
    setPhonePrefix((currentValue) => {
      if (phoneLocalNumber || !parsedPhone.prefix) {
        return currentValue;
      }

      return parsedPhone.prefix;
    });
    setPhoneLocalNumber((currentValue) => currentValue || parsedPhone.localNumber);
  }, [phoneLocalNumber, profile?.fullName, profile?.phone]);

  useEffect(() => {
    if (!feedbackMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, FEEDBACK_TIMEOUT);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedbackMessage]);

  function handleBackToCart() {
    navigate(ROUTES.CART);
  }

  function handleGoToMenu() {
    navigate(ROUTES.MENU);
  }

  function handleGoHome() {
    navigate(ROUTES.HOME);
  }

  function handleReopenWhatsapp() {
    if (!lastWhatsappUrl) {
      return;
    }

    window.open(lastWhatsappUrl, '_blank', 'noopener,noreferrer');
    setFeedbackMessage('Pedido reabierto en WhatsApp.');
  }

  function buildWhatsAppOrderMessage(ticket: string) {
    const orderTypeLabel =
      ORDER_TYPES.find((type) => type.id === orderType)?.label ?? 'Retirar';
    const paymentMethodLabel =
      PAYMENT_METHODS.find((paymentMethod) => paymentMethod.id === selectedPaymentMethod)?.label ??
      '';
    const messageLines = [
      'Hola Sorbo, quiero confirmar este pedido:',
      '',
      '*Pedido*',
      `Ticket: ${ticket}`,
      '',
      '*Cliente*',
      `Nombre: ${customerName.trim()}`,
      `Teléfono: ${customerPhone}`,
      '',
      '*Tipo de pedido*',
      orderTypeLabel,
      '',
      '*Pedido*',
    ];

    items.forEach((item, itemIndex) => {
      messageLines.push(
        `${itemIndex + 1}. ${item.quantity}x ${item.name} — ${formatPrice(item.lineTotal)}`,
      );

      item.customizations.forEach((customization) => {
        const priceDelta =
          customization.priceDelta > 0 ? ` (+${formatPrice(customization.priceDelta)})` : '';

        messageLines.push(
          `   · ${customization.groupName}: ${customization.optionName}${priceDelta}`,
        );
      });

      item.addOns.forEach((addOn) => {
        messageLines.push(`   · Extra: ${addOn.name} (+${formatPrice(addOn.price)})`);
      });

      if (item.specialInstructions.trim()) {
        messageLines.push(`   · Nota: ${item.specialInstructions.trim()}`);
      }
    });

    if (paymentMethodLabel) {
      messageLines.push('', '*Pago*', paymentMethodLabel);
    }

    if (notes.trim()) {
      messageLines.push('', '*Nota*', notes.trim());
    }

    messageLines.push('', '*Total*', formatPrice(subtotal), '', 'Enviado desde la app de Sorbo.');

    return messageLines.join('\n');
  }

  async function handlePrepareOrder() {
    if (submittedTicket !== null) {
      handleReopenWhatsapp();
      return;
    }

    if (!canPrepareOrder || isSubmitting || selectedPaymentMethod === null) {
      return;
    }

    const ticket = generateTemporaryOrderTicket();

    try {
      setIsSubmitting(true);
      setFeedbackMessage(null);

      await createOrder({
        userId: user?.id ?? null,
        items,
        total: subtotal,
        paymentMethod: selectedPaymentMethod,
        orderType,
        notes,
        ticket,
        customerName: customerName.trim(),
        customerPhone,
      });

      const message = buildWhatsAppOrderMessage(ticket);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      setSubmittedTicket(ticket);
      setLastWhatsappUrl(whatsappUrl);
      setSubmittedTotal(subtotal);
      clearCart();
      setFeedbackMessage('Pedido registrado y abierto en WhatsApp.');
    } catch (error) {
      console.error('[Sorbo] No pudimos registrar el pedido.', error);
      setFeedbackMessage('No pudimos registrar el pedido. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell showHeader={false} showBottomNav={true} className="bg-[#030406]">
      <div className="mx-auto flex min-h-full max-w-[720px] flex-col px-4 pb-[calc(env(safe-area-inset-bottom,0px)+124px)] pt-[calc(env(safe-area-inset-top,0px)+24px)]">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <button
            type="button"
            onClick={handleBackToCart}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.04] bg-black/[0.28] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/56 transition-colors duration-200 hover:text-[#F3D7A0]"
          >
            <ChevronLeft size={15} strokeWidth={2.1} />
            Volver
          </button>

          <div className="mt-6">
            <h1 className="font-playfair text-[34px] font-semibold leading-tight text-sorbo-cream">
              Confirmar pedido
            </h1>
            <p className="mt-2 max-w-[360px] text-[14px] leading-6 text-white/52">
              Solo faltan unos datos para confirmar tu pedido.
            </p>
          </div>
        </motion.header>

        {submittedTicket ? (
          <SubmittedCheckoutState
            ticket={submittedTicket}
            total={submittedTotal}
            feedbackMessage={feedbackMessage}
            onReopenWhatsapp={handleReopenWhatsapp}
            onNewOrder={handleGoToMenu}
            onGoHome={handleGoHome}
          />
        ) : !cartHasItems ? (
          <EmptyCheckoutState onGoToMenu={handleGoToMenu} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.04 }}
            className="mt-7 space-y-6"
          >
            <section className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">
                  Nombre
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Tu nombre"
                  className="mt-2 h-12 w-full rounded-[16px] border border-white/[0.04] bg-[#05070B]/72 px-4 text-[14px] text-white outline-none transition-colors duration-200 placeholder:text-white/24 focus:border-[rgba(212,168,83,0.28)]"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">
                  Teléfono
                </label>
                <div
                  className="relative mt-2 flex h-12 w-full rounded-[16px] border border-white/[0.04] bg-[#05070B]/72 transition-colors duration-200 focus-within:border-[rgba(212,168,83,0.28)]"
                  onBlur={(event) => {
                    const nextFocusTarget = event.relatedTarget as Node | null;

                    if (!event.currentTarget.contains(nextFocusTarget)) {
                      setIsPhonePrefixOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    className="flex h-full min-w-[88px] items-center justify-center gap-1.5 rounded-l-[15px] border-r border-white/[0.05] bg-black/[0.38] px-3 text-[13px] font-semibold text-[#F3D7A0] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 hover:bg-black/[0.48]"
                    aria-haspopup="listbox"
                    aria-expanded={isPhonePrefixOpen}
                    onClick={() => setIsPhonePrefixOpen((isOpen) => !isOpen)}
                  >
                    {phonePrefix}
                    <ChevronDown
                      size={14}
                      strokeWidth={2.1}
                      className={`transition-transform duration-200 ${
                        isPhonePrefixOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isPhonePrefixOpen ? (
                    <div
                      role="listbox"
                      className="absolute left-0 top-[calc(100%+6px)] z-20 w-[98px] overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#05070B] p-1 shadow-[0_18px_34px_rgba(0,0,0,0.42)]"
                    >
                      {VENEZUELAN_MOBILE_PREFIXES.map((prefix) => {
                        const isSelected = phonePrefix === prefix.value;

                        return (
                          <button
                            key={prefix.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            className={`flex h-9 w-full items-center justify-between rounded-[10px] px-3 text-[12px] font-semibold transition-colors duration-200 ${
                              isSelected
                                ? 'bg-[rgba(212,168,83,0.16)] text-[#F3D7A0]'
                                : 'text-white/60 hover:bg-white/[0.04] hover:text-white/82'
                            }`}
                            onClick={() => {
                              setPhonePrefix(prefix.value);
                              setIsPhonePrefixOpen(false);
                            }}
                          >
                            {prefix.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  <input
                    type="tel"
                    value={phoneLocalNumber}
                    onChange={(event) =>
                      setPhoneLocalNumber(sanitizeLocalPhoneNumber(event.target.value))
                    }
                    placeholder="1234567"
                    className="h-full min-w-0 flex-1 rounded-r-[15px] bg-transparent px-4 text-[14px] text-white outline-none placeholder:text-white/24"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={7}
                    aria-invalid={shouldShowPhoneError}
                    required
                  />
                </div>
                {shouldShowPhoneError ? (
                  <p className="mt-1.5 text-[11px] font-medium text-[#F3D7A0]/78">
                    Completa los 7 dígitos del teléfono.
                  </p>
                ) : null}
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/44">
                  Tipo de pedido
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {ORDER_TYPES.map((type) => {
                    const isSelected = orderType === type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setOrderType(type.id)}
                        className={`h-11 rounded-full border px-4 text-[12px] font-semibold transition-colors duration-200 ${
                          isSelected
                            ? 'border-transparent bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] text-[#120E09] shadow-[0_6px_18px_rgba(212,168,83,0.12)]'
                            : 'border-white/[0.04] bg-black/[0.24] text-white/58 hover:text-white/72'
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A853]/82">
                    Pago
                  </p>
                  <h2 className="mt-1 font-playfair text-[24px] font-semibold leading-tight text-sorbo-cream">
                    Método de pago
                  </h2>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((paymentMethod) => {
                  const isSelected = selectedPaymentMethod === paymentMethod.id;
                  const PaymentIcon = getPaymentIcon(paymentMethod.id);

                  return (
                    <button
                      key={paymentMethod.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedPaymentMethod(paymentMethod.id)}
                      className={`relative flex min-h-[58px] items-center gap-3 rounded-[18px] border p-2.5 text-left transition-colors duration-200 ${
                        isSelected
                          ? 'border-[rgba(212,168,83,0.45)] bg-[#05070B]/80 shadow-[0_0_14px_rgba(212,168,83,0.08)]'
                          : 'border-white/[0.035] bg-black/[0.22] hover:border-white/[0.08]'
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl border bg-black/[0.28] ${
                          isSelected
                            ? 'border-[rgba(212,168,83,0.28)] text-[#F3D7A0] shadow-[0_0_12px_rgba(212,168,83,0.08)]'
                            : 'border-white/[0.05] text-[#D4A853]'
                        }`}
                      >
                        <PaymentIcon size={23} strokeWidth={1.8} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-white">
                          {paymentMethod.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-white/42">
                          {paymentMethod.description}
                        </span>
                      </span>

                      {isSelected ? (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A853] text-[#120E09]">
                          <Check size={13} strokeWidth={2.4} />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <label className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A853]/65">
                Nota opcional
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Ej. sin cebolla, término medio…"
                rows={2}
                className="mt-2 w-full resize-none rounded-[18px] border border-white/[0.04] bg-[#05070B]/72 px-4 py-2.5 text-[14px] leading-5 text-white outline-none transition-colors duration-200 placeholder:text-white/24 focus:border-[rgba(212,168,83,0.28)]"
              />
            </section>

            <section className="border-t border-white/[0.06] pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[14px] font-medium text-white/68">Resumen</p>
                  <p className="mt-1 text-[11px] text-white/42">
                    {formatArticleCount(itemCount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">Subtotal</p>
                  <p className="mt-1 text-[22px] font-semibold text-[#F3D7A0]">
                    {formatPrice(subtotal)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {visibleItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-[12px]">
                    <p className="min-w-0 truncate text-white/62">
                      {item.quantity}x {item.name}
                    </p>
                    <p className="flex-none font-semibold text-white/72">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </div>
                ))}
                {hiddenItemCount > 0 ? (
                  <p className="text-[11px] font-medium text-white/38">
                    + {hiddenItemCount} más
                  </p>
                ) : null}
              </div>
            </section>

            {feedbackMessage ? (
              <p
                role="status"
                aria-live="polite"
                className="rounded-full border border-[rgba(212,168,83,0.16)] bg-black/[0.28] px-4 py-2 text-center text-[12px] font-medium text-[#F3D7A0]"
              >
                {feedbackMessage}
              </p>
            ) : null}

            <button
              type="button"
              disabled={isSubmitDisabled}
              aria-busy={isSubmitting}
              onClick={handlePrepareOrder}
              className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-transform duration-200 ${
                isSubmitDisabled
                  ? 'border border-white/[0.05] bg-white/[0.03] text-white/40'
                  : 'bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] text-[#120E09] hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? 'Registrando…' : 'Enviar por WhatsApp'}
            </button>

            {!canPrepareOrder ? (
              <p className="-mt-3 text-center text-[11px] font-medium text-white/38">
                Completa tus datos para continuar.
              </p>
            ) : null}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
