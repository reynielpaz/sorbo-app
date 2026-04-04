interface ProductCustomerDetailsProps {
  customerName: string;
  customerPhone: string;
  isNameInvalid: boolean;
  onCustomerNameChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
}

export function ProductCustomerDetails({
  customerName,
  customerPhone,
  isNameInvalid,
  onCustomerNameChange,
  onCustomerPhoneChange,
}: ProductCustomerDetailsProps) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(13,16,22,0.98)_0%,rgba(7,9,14,0.98)_100%)] px-5 py-5 shadow-[0_22px_46px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
            Datos del cliente
          </p>
          <h2 className="mt-2.5 font-playfair text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
            Para tu pedido
          </h2>
        </div>

        <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34">
          Nombre requerido
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/44">
            Nombre
          </span>
          <input
            type="text"
            autoComplete="name"
            value={customerName}
            onChange={(event) => onCustomerNameChange(event.target.value)}
            placeholder="Tu nombre"
            className={`w-full rounded-[22px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_0%,rgba(9,12,18,0.76)_100%)] px-4 py-3.5 text-[14px] text-white/86 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-white/28 ${
              isNameInvalid
                ? 'border-[rgba(212,168,83,0.3)] shadow-[0_0_0_1px_rgba(212,168,83,0.12)]'
                : 'border-white/[0.08]'
            }`}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/44">
            Teléfono
          </span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={customerPhone}
            onChange={(event) => onCustomerPhoneChange(event.target.value)}
            placeholder="Opcional"
            className="w-full rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_0%,rgba(9,12,18,0.76)_100%)] px-4 py-3.5 text-[14px] text-white/86 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-white/28"
          />
        </label>
      </div>

      <p className="mt-4 text-[12px] leading-6 text-white/44">
        Tu nombre ayudará a identificar el pedido. El teléfono es opcional.
      </p>
    </section>
  );
}
