import { useCallback, useEffect, useState } from "react"
import type { FormEvent } from "react"
import type { Professional, Service } from "@/types"
import { getSupabase } from "@/lib/supabase"
import { SalonError } from "@services/api"
import { appointmentsService } from "@services/appointments"
import { professionalsService } from "@services/professionals"

const timeZone = "America/Argentina/Buenos_Aires"

const dayFormat = new Intl.DateTimeFormat("sv-SE", { timeZone })
const hourFormat = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone
})

export const formatHour = (startsAt: string) =>
  hourFormat.format(new Date(startsAt))

type Selection = {
  serviceIds: number[]
  professionalId: string
  day: string
}

const normalizePhone = (value: string): string => {
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, "")

  return trimmed.startsWith("+") ? `+${digits}` : digits
}

type Stage = "selection" | "review" | "done"

export function useBooking(services: Service[]) {
  const today = dayFormat.format(new Date())

  const [isOpen, setIsOpen] = useState(false)
  const [stage, setStage] = useState<Stage>("selection")
  const [selection, setSelection] = useState<Selection>({
    serviceIds: [],
    professionalId: "",
    day: ""
  })
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [professionalsNote, setProfessionalsNote] = useState("")
  const [slots, setSlots] = useState<string[]>([])
  const [slotsNote, setSlotsNote] = useState("")
  const [selectedStart, setSelectedStart] = useState("")
  const [refresh, setRefresh] = useState(0)
  const [token, setToken] = useState<string>()
  const [needsPhone, setNeedsPhone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [reservationId, setReservationId] = useState<number>()

  const open = useCallback((serviceId?: number) => {
    setSelection({
      serviceIds: serviceId === undefined ? [] : [serviceId],
      professionalId: "",
      day: "",
    })
    setStage("selection")
    setSlots([])
    setSlotsNote("")
    setSelectedStart("")
    setToken(undefined)
    setNeedsPhone(false)
    setError("")
    setReservationId(undefined)
    setIsOpen(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    let active = true
    setProfessionals([])
    setProfessionalsNote("Cargando profesionales…")

    professionalsService.getProfessionals()
      .then(({ success, data, message }) => {
        if (!active) return
        if (!success || !data) throw new Error(message)

        setProfessionals(data)
        setProfessionalsNote(data.length ? "" : "No hay profesionales disponibles.")
      })
      .catch(() => {
        if (active) setProfessionalsNote("No pudimos cargar los profesionales.")
      })

    return () => { active = false }
  }, [isOpen])

  useEffect(() => {
    const { serviceIds, professionalId, day } = selection

    if (!isOpen || !serviceIds.length || !professionalId || !day || day < today) {
      return
    }

    const request = new AbortController()
    setSlotsNote("Buscando horarios…")

    appointmentsService.getAvailability(
      day, Number(professionalId), serviceIds, request.signal,
    )
      .then(({ success, data, message }) => {
        if (request.signal.aborted) return
        if (!success || !data) throw new Error(message)

        setSlots(data.available_starts)
        setSlotsNote(data.available_starts.length ? "" : "No hay horarios para ese día.")
      })
      .catch(() => {
        if (!request.signal.aborted) {
          setSlotsNote("No pudimos consultar los horarios. Probá con otro día.")
        }
      })

    return () => request.abort()
  }, [isOpen, selection, refresh, today])

  const changeSelection = (changes: Partial<Selection>) => {
    setSelection(current => ({ ...current, ...changes }))
    setSlots([])
    setSlotsNote("")
    setSelectedStart("")
    setError("")
  }

  const toggleService = (id: number) => {
    const { serviceIds } = selection
    changeSelection({
      serviceIds: serviceIds.includes(id)
        ? serviceIds.filter(serviceId => serviceId !== id)
        : [...serviceIds, id],
    })
  }

  const continueToReview = async () => {
    if (!selectedStart || busy) return

    setBusy(true)
    setError("")

    try {
      const { data, error: sessionError } = await getSupabase().auth.getSession()
      if (sessionError) throw sessionError

      setToken(data.session?.access_token)
      setStage("review")
    } catch {
      setError("No pudimos comprobar tu sesión. Volvé a intentar.")
    } finally {
      setBusy(false)
    }
  }

  const confirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy || !selectedStart) return

    const fields = new FormData(event.currentTarget)
    const first_name = String(fields.get("first_name") ?? "").trim()
    const last_name = String(fields.get("last_name") ?? "").trim()
    const phone = normalizePhone(String(fields.get("phone") ?? ""))

    if (!token && (!first_name || !last_name)) {
      setError("Completá tu nombre y apellido.")
      return
    }
    if ((!token || needsPhone) && !/^\+?\d{8,15}$/.test(phone)) {
      setError("Ingresá un teléfono de entre 8 y 15 dígitos.")
      return
    }

    const appointment = {
      professional_id: Number(selection.professionalId),
      service_ids: selection.serviceIds,
      starts_at: selectedStart
    }

    setBusy(true)
    setError("")

    try {
      const { success, data, message } = token
        ? await appointmentsService.createAccountAppointment(
            needsPhone ? { ...appointment, phone } : appointment,
            token,
          )
        : await appointmentsService.createGuestAppointment({
            ...appointment, first_name, last_name, phone,
          })

      if (!success || !data) throw new Error(message)

      setReservationId(data.id)
      setStage("done")
    } catch (cause) {
      if (cause instanceof SalonError && cause.code === "appointment_phone_required") {
        setNeedsPhone(true)
        setError("Completá tu teléfono para confirmar el turno.")
      } else if (cause instanceof SalonError && cause.status === 409) {
        setSlots([])
        setSlotsNote("")
        setSelectedStart("")
        setStage("selection")
        setRefresh(value => value + 1)
        setError("Ese horario se ocupó. Elegí otro.")
      } else {
        setError(cause instanceof Error ? cause.message : "No pudimos registrar el turno.")
      }
    } finally {
      setBusy(false)
    }
  }

  const back = () => {
    setError("")
    setStage("selection")
  }

  return {
    open, close: () => setIsOpen(false), stage, today, selection,
    professionals, professionalsNote, slots, slotsNote, selectedStart,
    selectStart: setSelectedStart, changeSelection, toggleService,
    continueToReview, confirm, back, busy, error, reservationId,
    isGuest: !token,
    showPhone: !token || needsPhone,
    selectedServices: services.filter(service => selection.serviceIds.includes(service.id)),
    selectedProfessional: professionals.find(item => String(item.id) === selection.professionalId),
  }
}