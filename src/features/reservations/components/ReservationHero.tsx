export function ReservationHero() {
  return (
    <section className="relative z-[1] bg-[#030303]">
      <div className="relative z-[1] h-[304px] overflow-hidden sm:h-[370px]">
        <img
          src="/images/reservations/sorbo-reservas-hero.jpeg"
          alt="Interior de Sorbo Café • Bistró"
          className="absolute inset-0 h-full w-full object-cover object-[center_48%] brightness-[0.9] contrast-[1.06] saturate-[0.94]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.26)_46%,rgba(3,3,3,0.82)_88%,#030303_100%)]" />
        <div className="absolute inset-x-[-1px] bottom-[-1px] h-[58%] bg-[linear-gradient(180deg,rgba(3,3,3,0)_0%,rgba(3,3,3,0.56)_56%,#030303_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(0,0,0,0.36)_0%,rgba(0,0,0,0)_100%)]" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[720px] px-5 pb-9 pt-12">
            <div className="max-w-[320px]">
              <h1 className="font-playfair text-[34px] font-semibold leading-[1] text-[#FCF8F0] sm:text-[40px]">
                Reserva tu mesa
              </h1>
              <p className="mt-2.5 text-[13px] leading-5 text-white/68">
                Coordina tu visita en segundos.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[-44px] z-0 h-24 bg-[linear-gradient(180deg,#030303_0%,rgba(3,3,3,0.92)_46%,rgba(3,3,3,0)_100%)]" />
      <div className="relative z-[1] h-6 bg-[#030303]" />
    </section>
  );
}
