import { useState } from 'react'
import { 
  Search, 
  CalendarDays, 
  Clock, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react'
import { useAppointments, useUpdateAppointment } from '../hooks/useAdminData'
import type { Appointment } from '../types'

const statusOptions = [
  { value: 'all', label: 'Todas', color: 'bg-beute-taupe' },
  { value: 'confirmed', label: 'Confirmadas', color: 'bg-green-500' },
  { value: 'pending', label: 'Pendientes', color: 'bg-amber-500' },
  { value: 'completed', label: 'Completadas', color: 'bg-blue-500' },
  { value: 'cancelled', label: 'Canceladas', color: 'bg-red-500' },
]

const statusStyles = {
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  'no-show': 'bg-gray-50 text-gray-700 border-gray-200',
}

const statusLabels = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
  'no-show': 'No asistió',
}

export function AppointmentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [_selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  
  const { data: appointments, isLoading } = useAppointments({
    status: statusFilter !== 'all' ? statusFilter as Appointment['status'] : undefined,
    search: search || undefined,
  })
  
  const updateMutation = useUpdateAppointment()

  const handleStatusChange = (id: string, status: Appointment['status']) => {
    updateMutation.mutate({ id, data: { status } })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-dream text-2xl text-beute-earth-deep">Gestión de Citas</h1>
          <p className="text-sm text-beute-taupe">Administra las citas de tus pacientes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-beute-gold text-white rounded-xl 
                          hover:bg-beute-gold-dark transition-colors">
          <Plus className="w-4 h-4" />
          <span className="font-medium">Nueva Cita</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beute-taupe" />
            <input
              type="text"
              placeholder="Buscar por paciente o servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-beute-taupe/20 
                        focus:border-beute-gold focus:outline-none transition-colors"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  statusFilter === status.value
                    ? 'bg-beute-gold text-white'
                    : 'bg-beute-cream/50 text-beute-earth-medium hover:bg-beute-cream'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${status.color}`} />
                {status.label}
              </button>
            ))}
          </div>
          
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-beute-taupe" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-beute-taupe/20 
                        focus:border-beute-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-beute-cream/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-beute-taupe uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-beute-taupe uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-beute-taupe uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-beute-taupe uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-beute-taupe uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beute-taupe/10">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-beute-taupe/20 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : appointments?.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-beute-cream/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-beute-gold/10 flex items-center justify-center">
                        <span className="font-medium text-beute-gold">
                          {appointment.patientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-beute-earth-dark">{appointment.patientName}</p>
                        <p className="text-xs text-beute-taupe">{appointment.patientPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-beute-earth-dark">{appointment.serviceName}</p>
                    <p className="text-xs text-beute-taupe">{appointment.duration} min</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-beute-gold" />
                      <span className="text-sm text-beute-earth-dark">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <Clock className="w-4 h-4 text-beute-taupe ml-2" />
                      <span className="text-sm text-beute-earth-dark">{appointment.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${
                        statusStyles[appointment.status]
                      }`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedAppointment(appointment)}
                      className="p-2 hover:bg-beute-cream rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-beute-taupe" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-beute-taupe/10 flex items-center justify-between">
          <p className="text-sm text-beute-taupe">
            Mostrando {appointments?.length || 0} citas
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-beute-cream rounded-lg transition-colors disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-beute-earth-dark">Página 1 de 1</span>
            <button className="p-2 hover:bg-beute-cream rounded-lg transition-colors disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
