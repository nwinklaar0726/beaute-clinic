import { useState } from 'react'
import { 
  Search, 
  CalendarDays, 
  Clock, 
  MoreHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react'

// Mock appointments data
const mockAppointments = [
  { 
    id: 1, 
    patientName: 'María González', 
    patientPhone: '+506 8888 1111',
    patientEmail: 'maria@email.com',
    service: 'Facial Hidratante', 
    duration: 60,
    date: '2024-03-14',
    time: '10:00', 
    status: 'confirmed',
    notes: 'Primera visita'
  },
  { 
    id: 2, 
    patientName: 'Ana Rodríguez', 
    patientPhone: '+506 8888 2222',
    patientEmail: 'ana@email.com',
    service: 'Nutrición Clínica', 
    duration: 45,
    date: '2024-03-14',
    time: '11:30', 
    status: 'pending',
    notes: ''
  },
  { 
    id: 3, 
    patientName: 'Carmen Silva', 
    patientPhone: '+506 8888 3333',
    patientEmail: 'carmen@email.com',
    service: 'Mesoterapia', 
    duration: 90,
    date: '2024-03-14',
    time: '14:00', 
    status: 'confirmed',
    notes: 'Seguimiento mensual'
  },
  { 
    id: 4, 
    patientName: 'Laura Martínez', 
    patientPhone: '+506 8888 4444',
    patientEmail: 'laura@email.com',
    service: 'Radiofrecuencia', 
    duration: 60,
    date: '2024-03-15',
    time: '09:00', 
    status: 'confirmed',
    notes: ''
  },
  { 
    id: 5, 
    patientName: 'Patricia López', 
    patientPhone: '+506 8888 5555',
    patientEmail: 'patricia@email.com',
    service: 'Consulta General', 
    duration: 30,
    date: '2024-03-15',
    time: '10:30', 
    status: 'pending',
    notes: 'Evaluación inicial'
  },
  { 
    id: 6, 
    patientName: 'Diana Herrera', 
    patientPhone: '+506 8888 6666',
    patientEmail: 'diana@email.com',
    service: 'Dermapen', 
    duration: 75,
    date: '2024-03-15',
    time: '14:00', 
    status: 'cancelled',
    notes: 'Canceló por emergencia'
  },
]

const statusOptions = [
  { value: 'all', label: 'Todas', color: 'bg-gray-500' },
  { value: 'confirmed', label: 'Confirmadas', color: 'bg-emerald-500' },
  { value: 'pending', label: 'Pendientes', color: 'bg-amber-500' },
  { value: 'completed', label: 'Completadas', color: 'bg-blue-500' },
  { value: 'cancelled', label: 'Canceladas', color: 'bg-red-500' },
]

const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

const statusLabels: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export function AppointmentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [_viewMode, _setViewMode] = useState<'list' | 'grid'>('list')

  const filteredAppointments = mockAppointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
                         apt.service.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter
    const matchesDate = !selectedDate || apt.date === selectedDate
    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Citas</h1>
          <p className="text-sm text-gray-500">Administra las citas de tus pacientes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl 
                            hover:bg-amber-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Nueva Cita</span>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por paciente o servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 
                        focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  statusFilter === status.value
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${status.color}`} />
                {status.label}
              </button>
            ))}
          </div>
          
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 
                        focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusOptions.filter(s => s.value !== 'all').map((status) => {
          const count = mockAppointments.filter(apt => apt.status === status.value).length
          return (
            <div key={status.value} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${status.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">{status.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="font-medium text-amber-600">
                          {appointment.patientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-xs text-gray-500">{appointment.patientPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{appointment.service}</p>
                    <p className="text-xs text-gray-500">{appointment.duration} min</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-gray-700">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <Clock className="w-4 h-4 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-700">{appointment.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={appointment.status}
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
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {filteredAppointments.length} de {mockAppointments.length} citas
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">Página 1 de 1</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
