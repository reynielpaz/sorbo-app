export function ReservationHero() {
  return (
    <section className="relative z-[1] overflow-hidden">
      <div className="relative h-[420px] sm:h-[500px]">
        <img
          src="/images/reservations/sorbo-reservas-hero.jpeg"
          alt="Interior de Sorbo Café • Bistró"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.14)_0%,rgba(4,6,10,0.34)_26%,rgba(6,8,12,0.68)_62%,rgba(6,8,12,0.96)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[54%] bg-[linear-gradient(180deg,rgba(8,10,15,0)_0%,rgba(8,10,15,0.2)_18%,rgba(8,10,15,0.92)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(4,6,10,0.32)_0%,rgba(4,6,10,0)_100%)]" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[720px] px-5 pb-8 pt-16">
            <div className="max-w-[320px]">
              <h1 className="font-playfair text-[38px] font-semibold leading-[1] text-[#FCF8F0] sm:text-[42px]">
                Reserva tu mesa
              </h1>
              <p className="mt-3 text-[14px] leading-6 text-white/72">
                Solicita tu visita y te confirmamos por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
