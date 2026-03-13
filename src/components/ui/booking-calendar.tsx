import * as React from "react"
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * BEAUTÉ BOOKING CALENDAR COMPONENT
 * 
 * Calendario de citas diseñado según el Brandbook:
 * - Vista mensual elegante
 * - Selección de fecha con estados visuales
 * - Slots de hora disponibles
 * - Diseño minimalista y médico
 */

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingCalendarProps {
  selectedDate: Date | null
  selectedTime: string | null
  onSelectDate: (date: Date) => void
  onSelectTime: (time: string) => void
  availableDates?: Date[]
  timeSlots?: TimeSlot[]
  minDate?: Date
  maxDate?: Date
  className?: string
}

// Helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const isDateInArray = (date: Date, array: Date[]) => {
  return array.some((d) => isSameDay(d, date))
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const BookingCalendar = React.forwardRef<HTMLDivElement, BookingCalendarProps>(
  ({
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime,
    availableDates = [],
    timeSlots = [],
    minDate = new Date(),
    maxDate,
    className,
  }, ref) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())
    
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    
    // Generate calendar days
    const days: (Date | null)[] = []
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    const handlePrevMonth = () => {
      setCurrentMonth(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1))
    }

    const isDateDisabled = (date: Date) => {
      // Check if date is before minDate
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
      if (date < minDateOnly) return true
      
      // Check if date is after maxDate
      if (maxDate && date > maxDate) return true
      
      // Check if date is in availableDates (if provided)
      if (availableDates.length > 0 && !isDateInArray(date, availableDates)) return true
      
      return false
    }

    return (
      <div ref={ref} className={cn("space-y-6", className)}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-beute-gold/10 text-beute-earth-medium hover:text-beute-gold transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h4 className="font-dream text-xl text-beute-earth-deep capitalize">
            {monthNames[month]} {year}
          </h4>
          
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-beute-gold/10 text-beute-earth-medium hover:text-beute-gold transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-lato font-semibold uppercase tracking-wider text-beute-taupe py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const isSelected = selectedDate && isSameDay(date, selectedDate)
            const isDisabled = isDateDisabled(date)
            const isToday = isSameDay(date, new Date())

            return (
              <button
                key={date.toISOString()}
                onClick={() => !isDisabled && onSelectDate(date)}
                disabled={isDisabled}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200",
                  isSelected && [
                    "bg-beute-gold text-white shadow-gold",
                    "hover:bg-beute-gold-dark",
                  ],
                  !isSelected && !isDisabled && [
                    "text-beute-earth-dark hover:bg-beute-gold/10 hover:text-beute-gold",
                    isToday && "bg-beute-gold/5 text-beute-gold font-semibold",
                  ],
                  isDisabled && [
                    "text-beute-taupe-light cursor-not-allowed",
                    "hover:bg-transparent",
                  ],
                  !isSelected && !isDisabled && !isToday && [
                    "bg-white/50",
                  ]
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="pt-4 border-t border-beute-taupe-light/50">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-beute-gold" />
              <span className="text-sm font-medium text-beute-earth-deep capitalize">
                {formatDate(selectedDate)}
              </span>
            </div>

            {/* Time Slots */}
            {timeSlots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-beute-gold" />
                  <span className="text-sm text-beute-earth-medium">
                    Selecciona una hora
                  </span>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && onSelectTime(slot.time)}
                      disabled={!slot.available}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        selectedTime === slot.time && [
                          "bg-beute-gold text-white shadow-gold",
                        ],
                        selectedTime !== slot.time && slot.available && [
                          "bg-white/50 text-beute-earth-dark hover:bg-beute-gold/10 hover:text-beute-gold",
                          "border border-beute-taupe-light/50",
                        ],
                        !slot.available && [
                          "bg-beute-taupe-light/30 text-beute-taupe cursor-not-allowed",
                          "line-through",
                        ]
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
BookingCalendar.displayName = "BookingCalendar"

export { BookingCalendar }
export type { BookingCalendarProps, TimeSlot }
