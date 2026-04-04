import {
  PRODUCT_ORDER_PAYMENT_METHODS,
  type ProductOrderPaymentMethodId,
} from '@/utils/constants';

interface ProductPaymentMethodSelectorProps {
  selectedPaymentMethod: ProductOrderPaymentMethodId | null;
  isInvalid: boolean;
  onChange: (paymentMethodId: ProductOrderPaymentMethodId) => void;
}

export function ProductPaymentMethodSelector({
  selectedPaymentMethod,
  isInvalid,
  onChange,
}: ProductPaymentMethodSelectorProps) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(13,16,22,0.98)_0%,rgba(7,9,14,0.98)_100%)] px-5 py-5 shadow-[0_22px_46px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
            Pago
          </p>
          <h2 className="mt-2.5 font-playfair text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
            Cómo vas a pagar
          </h2>
        </div>

        <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34">
          Requerido
        </span>
      </div>

      <fieldset className="mt-4">
        <legend className="sr-only">Selecciona un método de pago</legend>

        <div className="grid grid-cols-2 gap-2.5">
          {PRODUCT_ORDER_PAYMENT_METHODS.map((paymentMethod) => {
            const isSelected = selectedPaymentMethod === paymentMethod.id;

            return (
              <label
                key={paymentMethod.id}
                className={`flex cursor-pointer items-center justify-center rounded-[22px] border px-3 py-3.5 text-center transition-[border-color,background,transform,color] duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-[rgba(212,168,83,0.42)] bg-[linear-gradient(135deg,rgba(212,168,83,0.14)_0%,rgba(17,21,30,0.92)_100%)] text-[#FCF8F0] shadow-[0_10px_18px_rgba(0,0,0,0.16)]'
                    : 'border-white/[0.08] bg-[rgba(255,255,255,0.03)] text-white/74'
                }`}
              >
                <input
                  type="radio"
                  name="product-payment-method"
                  value={paymentMethod.id}
                  checked={isSelected}
                  onChange={() => onChange(paymentMethod.id)}
                  className="sr-only"
                />
                <span className="text-[12px] font-medium leading-5">
                  {paymentMethod.name}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className={`mt-4 text-[12px] leading-6 ${isInvalid ? 'text-[#E8C068]' : 'text-white/44'}`}>
        {isInvalid
          ? 'Elige cómo pagarás este pedido.'
          : 'Tu método de pago se enviará junto al pedido.'}
      </p>
    </section>
  );
}
