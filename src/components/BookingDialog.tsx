import { useEffect, useRef } from "react"
import type { Service } from "@/types"
import { formatHour, useBooking } from "@/hooks/useBooking"

const field = "w-full rounded-md border border-aura-line bg-white px-3 py-2"
const primary = "rounded-md bg-aura-plum px-4 py-2 font-semibold text-white disabled:opacity-50"

export default function BookingDialog({ services }: { services: Service[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const { open, ...booking } = useBooking(services)
  console.log(booking)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return

      const button = event.target.closest<HTMLButtonElement>("button[data-book]")
      const modal = dialog.current
      if (!button || !modal || modal.open) return

      const id = button.dataset.serviceId
      open(id === undefined ? undefined : Number(id))
      modal.showModal()
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [open])

  const { selection, stage, busy, selectedStart } = booking
  const canSearch = selection.serviceIds.length > 0 &&
    Boolean(selection.professionalId && selection.day)

  return (
    <dialog
      ref={dialog}
      aria-labelledby="booking-title"
      onClose={booking.close}
      onCancel={event => { if (busy) event.preventDefault() }}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-auto rounded-lg border border-aura-line bg-aura-paper p-6 backdrop:bg-black/50"
    >
      <header className="mb-5 flex items-center justify-between gap-4">
        <h2 id="booking-title" className="font-display text-4xl text-aura-plum">
          Reservá tu turno
        </h2>
        <button
          type="button"
          aria-label="Cerrar reserva"
          disabled={busy}
          onClick={() => dialog.current?.close()}
        >
          ✕
        </button>
      </header>

      {stage === "selection" && (
        <fieldset disabled={busy} className="space-y-4">
          <div role="group" aria-label="Servicios">
            <p className="mb-2 font-semibold">Servicios</p>
            {services.map(service => (
              <label key={service.id} className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  checked={selection.serviceIds.includes(service.id)}
                  onChange={() => booking.toggleService(service.id)}
                />
                {service.name} · {service.duration_minutes} min
              </label>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              Profesional
              <select
                className={field}
                value={selection.professionalId}
                onChange={event => booking.changeSelection({ professionalId: event.target.value })}
              >
                <option value="">Elegí un profesional</option>
                {booking.professionals.map(professional => (
                  <option key={professional.id} value={professional.id}>
                    {professional.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Día
              <input
                className={field}
                type="date"
                min={booking.today}
                value={selection.day}
                onChange={event => booking.changeSelection({ day: event.target.value })}
              />
            </label>
          </div>

          <div>
            <p className="mb-2 font-semibold">Horarios disponibles</p>
            <p role="status" className="text-sm text-aura-muted">
              {booking.professionalsNote ||
                (canSearch ? booking.slotsNote : "Elegí los servicios, el profesional y el día.")}
            </p>
            <div className="flex flex-wrap gap-2">
              {booking.slots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={selectedStart === slot}
                  onClick={() => booking.selectStart(slot)}
                  className="rounded-full border border-aura-line px-3 py-2 aria-pressed:bg-aura-plum aria-pressed:text-white"
                >
                  {formatHour(slot)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={primary}
            disabled={!selectedStart || busy}
            onClick={booking.continueToReview}
          >
            Continuar
          </button>
        </fieldset>
      )}

      {stage === "review" && (
        <form onSubmit={booking.confirm} className="space-y-4">
          <div className="rounded-md bg-aura-blush p-3">
            <p>{booking.selectedServices.map(service => service.name).join(", ")}</p>
            <p>
              {booking.selectedProfessional?.name} · {selection.day} · {formatHour(selectedStart)}
            </p>
          </div>

          <fieldset disabled={busy} className="space-y-3">
            {booking.isGuest && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  Nombre
                  <input name="first_name" autoComplete="given-name" maxLength={100} required className={field} />
                </label>
                <label>
                  Apellido
                  <input name="last_name" autoComplete="family-name" maxLength={100} required className={field} />
                </label>
              </div>
            )}

            {booking.showPhone && (
              <label className="block">
                Teléfono
                <input name="phone" type="tel" autoComplete="tel" required className={field} />
              </label>
            )}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={booking.back}>Volver</button>
              <button type="submit" className={primary}>
                {busy ? "Guardando…" : "Confirmar turno"}
              </button>
            </div>
          </fieldset>
        </form>
      )}

      {stage === "done" && (
        <p role="status">Turno registrado. Número de reserva: {booking.reservationId}.</p>
      )}

      {booking.error && (
        <p role="alert" className="mt-3 text-sm text-aura-rose">{booking.error}</p>
      )}
    </dialog>
  )
}