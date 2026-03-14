import { useState } from 'react'
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  Plus,
  MoreHorizontal
} from 'lucide-react'

// Mock patients data
const mockPatients = [
  {
    id: 1,
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@email.com',
    phone: '+506 8888 1111',
    dateOfBirth: '1985-03-15',
    totalAppointments: 12,
    lastVisit: '2024-03-10',
    nextAppointment: '2024-03-20',
    status: 'active',
    notes: 'Alergia a ciertos productos'
  },
  {
    id: 2,
    firstName: 'Ana',
    lastName: 'Rodríguez',
    email: 'ana.rodriguez@email.com',
    phone: '+506 8888 2222',
    dateOfBirth: '1990-07-22',
    totalAppointments: 8,
    lastVisit: '2024-03-05',
    nextAppointment: '2024-03-14',
    status: 'active',
    notes: ''
  },
  {
    id: 3,
    firstName: 'Carmen',
    lastName: 'Silva',
    email: 'carmen.silva@email.com',
    phone: '+506 8888 3333',
    dateOfBirth: '1978-11-30',
    totalAppointments: 25,
    lastVisit: '2024-03-01',
    nextAppointment: null,
    status: 'inactive',
    notes: 'Paciente VIP'
  },
  {
    id: 4,
    firstName: 'Laura',
    lastName: 'Martínez',
    email: 'laura.martinez@email.com',
    phone: '+506 8888 4444',
    dateOfBirth: '1995-01-10',
    totalAppointments: 3,
    lastVisit: '2024-02-28',
    nextAppointment: '2024-03-15',
    status: 'active',
    notes: 'Primera consulta en enero'
  },
  {
    id: 5,
    firstName: 'Patricia',
    lastName: 'López',
    email: 'patricia.lopez@email.com',
    phone: '+506 8888 5555',
    dateOfBirth: '1982-09-05',
    totalAppointments: 15,
    lastVisit: '2024-03-08',
    nextAppointment: '2024-03-22',
    status: 'active',
    notes: ''
  },
  {
    id: 6,
    firstName: 'Diana',
    lastName: 'Herrera',
    email: 'diana.herrera@email.com',
    phone: '+506 8888 6666',
    dateOfBirth: '1988-12-18',
    totalAppointments: 6,
    lastVisit: '2024-02-15',
    nextAppointment: null,
    status: 'inactive',
    notes: 'Canceló última cita'
  },
]

export function PatientsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [_viewMode, _setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredPatients = mockPatients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase()) ||
                         patient.email.toLowerCase().includes(search.toLowerCase()) ||
                         patient.phone.includes(search)
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-sm text-gray-500">Gestiona la información de tus pacientes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl 
                          hover:bg-amber-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span className="font-medium">Nuevo Paciente</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 
                      focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'Todos' : status === 'active' ? 'Activos' : 'Inactivos'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{mockPatients.length}</p>
          <p className="text-xs text-gray-500">Total Pacientes</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">
            {mockPatients.filter(p => p.status === 'active').length}
          </p>
          <p className="text-xs text-gray-500">Activos</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-amber-600">
            {mockPatients.filter(p => p.nextAppointment).length}
          </p>
          <p className="text-xs text-gray-500">Con Cita Próxima</p>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div 
            key={patient.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 
                                flex items-center justify-center border-2 border-amber-100">
                  <span className="font-bold text-amber-600 text-lg">
                    {getInitials(patient.firstName, patient.lastName)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Paciente desde {new Date(patient.dateOfBirth).toLocaleDateString('es-ES', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    patient.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-amber-600" />
                {patient.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-amber-600" />
                <span className="truncate">{patient.email}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100">
              <div className="text-center">
                <p className="font-bold text-gray-900">{patient.totalAppointments}</p>
                <p className="text-xs text-gray-500">Citas</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Última visita</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(patient.lastVisit).toLocaleDateString('es-ES', { 
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            </div>

            {/* Next Appointment */}
            {patient.nextAppointment && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-600 font-medium mb-1">Próxima cita</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(patient.nextAppointment).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                                bg-amber-600 text-white rounded-xl text-sm font-medium
                                hover:bg-amber-700 transition-colors">
                <Calendar className="w-4 h-4" />
                Agendar
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                                bg-gray-100 text-gray-700 rounded-xl text-sm font-medium
                                hover:bg-gray-200 transition-colors">
                <FileText className="w-4 h-4" />
                Historial
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron pacientes</h3>
          <p className="text-gray-500 mb-4">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  )
}
