import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, User, Mail, Phone, MessageSquare, Check, ChevronLeft, ChevronRight, Sparkles, Clock, Loader2 } from 'lucide-react'
import { SectionHeader, SectionContainer } from '@/components/ui/section-header'
import { CardLuxury, CardContent } from '@/components/ui/card-luxury'
import { ButtonLuxury } from '@/components/ui/button-luxury'
import { BookingCalendar } from '@/components/ui/booking-calendar'
import { getServices, getAvailableSlots, createAppointment, type Service } from '@/services/api'

/**
 * BEAUTÉ BOOKING SECTION
 * 
 * Sistema de citas wizard de 4 pasos integrado con appointment-bot API
 */

const specialists = [
  { id: 'meyryn', name: 'Dra. Meyryn Carrillo', role: 'Directora Médica' },
  { id: 'equipo', name: 'Equipo Beauté', role: 'Especialistas' },
]

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  specialist: string
  date: Date | null
  time: string
  notes: string
  isNewPatient: boolean
}

interface BookingProps {
  showNotification?: (message: string) => void
  initialService?: string
}

export function Booking({ showNotification, initialService }: BookingProps = {}) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: initialService || '',
    specialist: '',
    date: null,
    time: '',
    notes: '',
    isNewPatient: true,
  })

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        console.error('Error loading services:', error)
        // Fallback to empty array if API fails
        setServices([])
      }
    }
    loadServices()
  }, [])

  // Load available slots when date changes
  useEffect(() => {
    if (formData.date) {
      const loadSlots = async () => {
        setIsLoading(true)
        try {
          const dateStr = formData.date!.toISOString().split('T')[0]
          const slots = await getAvailableSlots(dateStr)
          setTimeSlots(slots.map((slot: string) => ({ time: slot, available: true })))
        } catch (error) {
          console.error('Error loading slots:', error)
          // Fallback slots
          setTimeSlots([
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30', '18:00'
          ].map(time => ({ time, available: true })))
        } finally {
          setIsLoading(false)
        }
      }
      loadSlots()
    }
  }, [formData.date])

  const handleInputChange = (field: keyof FormData, value: string | boolean | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.service && formData.specialist
      case 2: return formData.date && formData.time
      case 3: return formData.name && formData.email && formData.phone
      default: return true
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Combine date and time for appointment
      const appointmentDate = formData.date!
      const [hours, minutes] = formData.time.split(':')
      appointmentDate.setHours(parseInt(hours), parseInt(minutes))
      
      await createAppointment({
        patient_name: formData.name,
        patient_phone: formData.phone,
        appointment_at: appointmentDate.toISOString(),
        service: formData.service,
        notes: formData.notes,
        channel: 'web',
      })
      
      if (showNotification) {
        showNotification('¡Cita agendada exitosamente! Te enviamos un correo de confirmación.')
      }
      
      // Reset form
      setStep(1)
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        specialist: '',
        date: null,
        time: '',
        notes: '',
        isNewPatient: true,
      })
    } catch (error) {
      console.error('Error creating appointment:', error)
      if (showNotification) {
        showNotification('Error al agendar la cita. Por favor intenta de nuevo.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Servicio', description: 'Elige tu tratamiento' },
    { number: 2, title: 'Fecha', description: 'Selecciona día y hora' },
    { number: 3, title: 'Datos', description: 'Tu información' },
    { number: 4, title: 'Confirmar', description: 'Revisa y confirma' },
  ]

  const selectedService = services.find(s => s.id === formData.service)
  const selectedSpecialist = specialists.find(s => s.id === formData.specialist)

  return (
    <SectionContainer 
      id="agendar" 
      className="bg-gradient-to-b from-beute-cream-light/30 to-beute-cream"
      withPattern
    >
      {/* Section Header */}
      <div className="flex justify-center">
        <SectionHeader
          label="Reserva tu Cita"
          labelIcon={<CalendarIcon className="w-4 h-4" />}
          title="Agenda tu"
          titleHighlight="Consulta"
          subtitle="Reserva tu cita en minutos. Selecciona el servicio, fecha y hora que más te convenga."
          align="center"
        />
      </div>

      {/* Booking Card */}
      <CardLuxury variant="glass" padding="none" className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="bg-beute-gold/5 px-6 py-6 border-b border-beute-taupe-light/30">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const isActive = step === s.number
              const isCompleted = step > s.number
              
              return (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    {/* Step circle */}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                      isCompleted && "bg-beute-gold text-white",
                      isActive && "bg-beute-gold text-white ring-4 ring-beute-gold/20",
                      !isActive && !isCompleted && "bg-beute-taupe-light text-beute-taupe"
                    )}>
                      {isCompleted ? <Check className="w-5 h-5" /> : s.number}
                    </div>
                    
                    {/* Step label - show current step on mobile */}
                    <div className="mt-2 text-center">
                      <span className={cn(
                        "text-[10px] sm:text-xs font-medium block",
                        isActive || isCompleted ? "text-beute-earth-dark" : "text-beute-taupe",
                        // Only show active step title on mobile to save space
                        !isActive && "hidden sm:block"
                      )}>
                        {s.title}
                      </span>
                      <span className="text-[10px] text-beute-taupe hidden lg:block">
                        {s.description}
                      </span>
                    </div>
                  </div>
                  
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className={cn(
                      "w-4 sm:w-8 md:w-16 lg:w-24 h-0.5 mx-1 sm:mx-2 md:mx-4 transition-all duration-300",
                      step > s.number ? "bg-beute-gold" : "bg-beute-taupe-light"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <CardContent className="p-6 sm:p-8">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Service */}
              <div>
                <label className="label mb-3">Selecciona un servicio</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleInputChange('service', service.id)}
                        className={cn(
                          "p-4 rounded-xl text-left border-2 transition-all duration-200",
                          formData.service === service.id
                            ? "border-beute-gold bg-beute-gold/5 shadow-gold"
                            : "border-beute-taupe-light/50 bg-white/50 hover:border-beute-gold/30"
                        )}
                      >
                        <span className="text-xs text-beute-gold font-medium uppercase tracking-wider">
                          {service.category || 'Servicio'}
                        </span>
                        <p className="font-medium text-beute-earth-dark mt-1">{service.name}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-beute-taupe">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                        </div>
                      </button>
                    ))
                  ) : (
                    // Fallback while loading
                    [1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-4 rounded-xl border-2 border-beute-taupe-light/30 bg-white/50 animate-pulse">
                        <div className="h-3 w-20 bg-beute-taupe-light/30 rounded mb-2" />
                        <div className="h-4 w-32 bg-beute-taupe-light/30 rounded" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Specialist */}
              <div>
                <label className="label mb-3">Especialista</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {specialists.map((specialist) => (
                    <button
                      key={specialist.id}
                      onClick={() => handleInputChange('specialist', specialist.id)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                        formData.specialist === specialist.id
                          ? "border-beute-gold bg-beute-gold/5 shadow-gold"
                          : "border-beute-taupe-light/50 bg-white/50 hover:border-beute-gold/30"
                      )}
                    >
                      <div className="w-12 h-12 rounded-full bg-beute-gold/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-beute-gold" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-beute-earth-dark">{specialist.name}</p>
                        <p className="text-xs text-beute-taupe">{specialist.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="animate-fade-in">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-beute-gold animate-spin" />
                  <span className="ml-2 text-beute-earth-medium">Cargando horarios...</span>
                </div>
              ) : (
                <BookingCalendar
                  selectedDate={formData.date}
                  selectedTime={formData.time}
                  onSelectDate={(date) => handleInputChange('date', date)}
                  onSelectTime={(time) => handleInputChange('time', time)}
                  timeSlots={timeSlots}
                />
              )}
            </div>
          )}

          {/* Step 3: Patient Data */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {/* Patient type */}
              <div className="flex gap-4 p-4 bg-beute-gold/5 rounded-xl border border-beute-gold/20">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isNewPatient}
                    onChange={() => handleInputChange('isNewPatient', true)}
                    className="w-4 h-4 text-beute-gold border-beute-taupe-light focus:ring-beute-gold"
                  />
                  <span className="text-sm text-beute-earth-dark">Primera vez</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.isNewPatient}
                    onChange={() => handleInputChange('isNewPatient', false)}
                    className="w-4 h-4 text-beute-gold border-beute-taupe-light focus:ring-beute-gold"
                  />
                  <span className="text-sm text-beute-earth-dark">Paciente recurrente</span>
                </label>
              </div>

              {/* Name */}
              <div>
                <label className="label mb-2">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-beute-gold" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Tu nombre completo"
                    className="input pl-12"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="label mb-2">Correo electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-beute-gold" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="input pl-12"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="label mb-2">Teléfono *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-beute-gold" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+506 8888 8888"
                    className="input pl-12"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="label mb-2">Notas adicionales (opcional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-beute-gold" />
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="¿Tienes alguna alergia, condición médica o preferencia especial que debamos conocer?"
                    className="input pl-12 min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              {/* Success header */}
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-beute-gold flex items-center justify-center shadow-gold">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-dream text-2xl text-beute-earth-dark mb-2">
                  Confirma tu cita
                </h3>
                <p className="text-beute-earth-medium">
                  Revisa los detalles antes de confirmar
                </p>
              </div>

              {/* Summary */}
              <div className="bg-beute-cream rounded-2xl p-6 space-y-4">
                <div className="flex justify-between py-2 border-b border-beute-taupe-light/50">
                  <span className="text-beute-taupe text-sm">Servicio</span>
                  <span className="text-beute-earth-dark font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-beute-taupe-light/50">
                  <span className="text-beute-taupe text-sm">Especialista</span>
                  <span className="text-beute-earth-dark font-medium">{selectedSpecialist?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-beute-taupe-light/50">
                  <span className="text-beute-taupe text-sm">Fecha</span>
                  <span className="text-beute-earth-dark font-medium capitalize">
                    {formData.date?.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-beute-taupe-light/50">
                  <span className="text-beute-taupe text-sm">Hora</span>
                  <span className="text-beute-earth-dark font-medium">{formData.time}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-beute-taupe-light/50">
                  <span className="text-beute-taupe text-sm">Paciente</span>
                  <span className="text-beute-earth-dark font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-beute-taupe text-sm">Contacto</span>
                  <span className="text-beute-earth-dark font-medium text-sm">{formData.email}</span>
                </div>
                
                {formData.notes && (
                  <div className="pt-4 border-t border-beute-taupe-light/50">
                    <span className="text-beute-taupe text-sm block mb-1">Notas</span>
                    <span className="text-beute-earth-dark text-sm">{formData.notes}</span>
                  </div>
                )}
              </div>

              {/* Info note */}
              <div className="flex items-start gap-3 p-4 bg-beute-olive/5 rounded-xl border border-beute-olive/20">
                <div className="w-5 h-5 rounded-full bg-beute-olive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-beute-olive text-xs font-bold">i</span>
                </div>
                <p className="text-sm text-beute-earth-medium">
                  Recibirás un correo de confirmación con los detalles de tu cita. 
                  Te enviaremos un recordatorio 24 horas antes.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-beute-taupe-light/30">
            {step > 1 ? (
              <ButtonLuxury
                variant="ghost"
                onClick={() => setStep(step - 1)}
                disabled={isSubmitting}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Anterior
              </ButtonLuxury>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <ButtonLuxury
                variant="primary"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Siguiente
              </ButtonLuxury>
            ) : (
              <ButtonLuxury
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                rightIcon={<Check className="w-4 h-4" />}
              >
                Confirmar Cita
              </ButtonLuxury>
            )}
          </div>
        </CardContent>
      </CardLuxury>

      {/* Contact Info */}
      <div className="mt-10 text-center animate-fade-in-up">
        <p className="text-beute-earth-medium text-sm mb-3">
          ¿Prefieres agendar por teléfono?
        </p>
        <a 
          href="tel:+50688888888" 
          className="inline-flex items-center gap-2 text-beute-gold font-medium hover:text-beute-gold-dark transition-colors"
        >
          <Phone className="w-4 h-4" />
          +506 8888 8888
        </a>
      </div>
    </SectionContainer>
  )
}

// Utility for className merging
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
