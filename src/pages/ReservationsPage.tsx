import { motion } from 'framer-motion';
import { CalendarDays, MessageSquareText, Phone, UserRound } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ReservationActionBar } from '@/features/reservations/components/ReservationActionBar';
import { ReservationGuestStepper } from '@/features/reservations/components/ReservationGuestStepper';
import { ReservationHero } from '@/features/reservations/components/ReservationHero';
import { ReservationOccasionSelector } from '@/features/reservations/components/ReservationOccasionSelector';
import { ReservationSectionCard } from '@/features/reservations/components/ReservationSectionCard';
import { ReservationTimeSelector } from '@/features/reservations/components/ReservationTimeSelector';
import { useReservationForm } from '@/features/reservations/hooks/useReservationForm';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

export function ReservationsPage() {
  const { profile } = useAuth();
  const reservationForm = useReservationForm({
    initialCustomerName: profile?.fullName,
    initialCustomerPhone: profile?.phone,
  });

  return (
    <AppShell showHeader={false}>
      <div className="relative min-h-full overflow-x-hidden pb-[calc(env(safe-area-inset-bottom,0px)+272px)]">
        <ReservationHero />

        <div className="relative z-[1] mx-auto -mt-4 max-w-[720px]">
          <form
            id="reservations-form"
            onSubmit={(event) => {
              event.preventDefault();
              reservationForm.submitReservation();
            }}
            className="px-4 pt-3"
          >
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 }}
              >
                <ReservationSectionCard
                  eyebrow="Reserva"
                  title="Fecha y hora"
                  description="Elige la fecha y la hora sugerida."
                  badge="Requerido"
                >
                  <div className="space-y-[18px]">
                    <label className="block">
                      <span className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.22em] text-white/44">
                        Fecha de la visita
                      </span>
                      <div
                        className={cn(
                          'group relative flex items-center gap-3 overflow-hidden rounded-[24px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(10,13,19,0.7)_100%)] px-4 py-4 text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[10px] transition-[border-color,box-shadow] duration-200',
                          reservationForm.visibleErrors.visitDate
                            ? 'border-[rgba(212,168,83,0.3)] shadow-[0_0_0_1px_rgba(212,168,83,0.12)]'
                            : 'border-white/[0.08] focus-within:border-[#D4A853]/18 focus-within:shadow-[0_0_0_1px_rgba(212,168,83,0.08)]'
                        )}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[#D4A853]/14 bg-[#D4A853]/10 text-[#E8C37E]">
                          <CalendarDays size={18} className="shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/34">
                            Día sugerido
                          </p>
                          <input
                            type="date"
                            min={reservationForm.minDate}
                            value={reservationForm.visitDate}
                            onChange={(event) => reservationForm.setVisitDate(event.target.value)}
                            onBlur={reservationForm.touchVisitDate}
                            className="mt-1.5 w-full bg-transparent text-[14px] outline-none [color-scheme:dark]"
                          />
                        </div>
                      </div>
                      {reservationForm.visitDate ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-white/62 backdrop-blur-sm">
                            {reservationForm.formattedDateLabel}
                          </span>
                          {!reservationForm.businessHoursLoading && reservationForm.selectedDayScheduleSummary ? (
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-white/50 backdrop-blur-sm">
                              {reservationForm.selectedDayScheduleSummary}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                      {reservationForm.visibleErrors.visitDate ? (
                        <p className="mt-2 text-[12px] leading-5 text-[#E8C37E]">
                          {reservationForm.visibleErrors.visitDate}
                        </p>
                      ) : (
                        <p className="mt-2 text-[12px] leading-5 text-white/40">
                          Te confirmamos por WhatsApp.
                        </p>
                      )}
                    </label>

                    <div>
                      <div className="mb-2.5 flex items-center justify-between gap-3">
                        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/44">
                          Hora sugerida
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                          Requerido
                        </span>
                      </div>

                      <ReservationTimeSelector
                        hasDate={Boolean(reservationForm.visitDate)}
                        loading={reservationForm.businessHoursLoading}
                        isClosed={reservationForm.isClosedForSelectedDate}
                        groups={reservationForm.timeGroups}
                        value={reservationForm.visitTime}
                        error={reservationForm.visibleErrors.visitTime}
                        onChange={reservationForm.setVisitTime}
                      />
                    </div>
                  </div>
                </ReservationSectionCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <ReservationSectionCard
                  eyebrow="Mesa"
                  title="Personas y motivo"
                  description="Indícanos cuántas personas serán y, si quieres, la ocasión."
                  badge="Flexible"
                >
                  <div className="space-y-[18px]">
                    <ReservationGuestStepper
                      guestCount={reservationForm.guestCount}
                      isInvalid={Boolean(reservationForm.visibleErrors.guestCount)}
                      error={reservationForm.visibleErrors.guestCount}
                      onDecrease={reservationForm.decrementGuestCount}
                      onIncrease={reservationForm.incrementGuestCount}
                    />

                    <div>
                      <div className="mb-2.5 flex items-center justify-between gap-3">
                        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/44">
                          Motivo
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                          Opcional
                        </span>
                      </div>

                      <ReservationOccasionSelector
                        options={reservationForm.occasionOptions}
                        value={reservationForm.occasion}
                        onChange={reservationForm.setOccasion}
                      />
                    </div>
                  </div>
                </ReservationSectionCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
              >
                <ReservationSectionCard
                  eyebrow="Contacto"
                  title="Tus datos"
                  description="Déjanos tus datos para confirmar la reserva."
                  badge="Nombre requerido"
                >
                  <div className="space-y-3.5">
                    <label className="block">
                      <span className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.22em] text-white/44">
                        Nombre
                      </span>
                      <div
                        className={cn(
                          'group relative flex items-center gap-3 overflow-hidden rounded-[24px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(10,13,19,0.7)_100%)] px-4 py-4 text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[10px] transition-[border-color,box-shadow] duration-200',
                          reservationForm.visibleErrors.customerName
                            ? 'border-[rgba(212,168,83,0.3)] shadow-[0_0_0_1px_rgba(212,168,83,0.12)]'
                            : 'border-white/[0.08] focus-within:border-[#D4A853]/18 focus-within:shadow-[0_0_0_1px_rgba(212,168,83,0.08)]'
                        )}
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[#D4A853]/14 bg-[#D4A853]/10 text-[#E8C37E]">
                          <UserRound size={18} className="shrink-0" />
                        </div>
                        <input
                          type="text"
                          autoComplete="name"
                          value={reservationForm.customerName}
                          onChange={(event) => reservationForm.setCustomerName(event.target.value)}
                          onBlur={reservationForm.touchCustomerName}
                          placeholder="Tu nombre"
                          className="w-full bg-transparent text-[14px] outline-none placeholder:text-white/28"
                        />
                      </div>
                      {reservationForm.visibleErrors.customerName ? (
                        <p className="mt-2 text-[12px] leading-5 text-[#E8C37E]">
                          {reservationForm.visibleErrors.customerName}
                        </p>
                      ) : null}
                    </label>

                    <label className="block">
                      <span className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.22em] text-white/44">
                        Teléfono
                      </span>
                      <div className="group relative flex items-center gap-3 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(10,13,19,0.7)_100%)] px-4 py-4 text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[10px] transition-[border-color,box-shadow] duration-200 focus-within:border-[#D4A853]/18 focus-within:shadow-[0_0_0_1px_rgba(212,168,83,0.08)]">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[#D4A853]/14 bg-[#D4A853]/10 text-[#E8C37E]">
                          <Phone size={18} className="shrink-0" />
                        </div>
                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={reservationForm.customerPhone}
                          onChange={(event) => reservationForm.setCustomerPhone(event.target.value)}
                          placeholder="Opcional"
                          className="w-full bg-transparent text-[14px] outline-none placeholder:text-white/28"
                        />
                      </div>
                      <p className="mt-2 text-[12px] leading-5 text-white/40">
                        Opcional, pero útil para contactarte.
                      </p>
                    </label>
                  </div>
                </ReservationSectionCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24 }}
              >
                <ReservationSectionCard
                  eyebrow="Detalles"
                  title="Detalles adicionales"
                  badge="Opcional"
                >
                  <div className="overflow-hidden rounded-[26px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(10,13,19,0.68)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[10px]">
                    <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#D4A853]/14 bg-[#D4A853]/10 text-[#E8C37E]">
                        <MessageSquareText size={17} />
                      </div>
                      <p className="text-[12px] leading-5 text-white/46">
                        Déjanos aquí cualquier detalle importante.
                      </p>
                    </div>

                    <textarea
                      value={reservationForm.specialNotes}
                      onChange={(event) => reservationForm.setSpecialNotes(event.target.value)}
                      rows={4}
                      maxLength={reservationForm.notesLimit}
                      placeholder="Cuéntanos si hay algo que debamos tener en cuenta."
                      className="min-h-[138px] w-full resize-none bg-transparent px-4 py-4 text-[14px] leading-7 text-white/84 outline-none placeholder:text-white/30"
                    />

                    <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3.5">
                      <p className="text-[11px] leading-5 text-white/42">
                        Si no hace falta, déjalo en blanco.
                      </p>
                      <span className="text-[11px] font-medium tracking-[0.02em] text-white/34">
                        {reservationForm.specialNotesCount}/{reservationForm.notesLimit}
                      </span>
                    </div>
                  </div>
                </ReservationSectionCard>
              </motion.div>
            </div>
          </form>

          <ReservationActionBar
            formId="reservations-form"
            isValid={reservationForm.isValid}
            supportCopy={reservationForm.supportCopy}
            summaryLabel={reservationForm.summaryLabel}
          />
        </div>
      </div>
    </AppShell>
  );
}
