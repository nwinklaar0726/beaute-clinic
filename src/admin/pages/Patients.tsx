import { useState } from 'react'
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  ChevronRight,
  Plus
} from 'lucide-react'
import { usePatients } from '../hooks/useAdminData'

export function PatientsPage() {
  const [search, setSearch] = useState('')
  const [_selectedPatient, setSelectedPatient] = useState<string | null>(null)
  
  const { data: patients, isLoading } = usePatients({ search: search || undefined })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-dream text-2xl text-beute-earth-deep">Pacientes</h1>
          <p className="text-sm text-beute-taupe">Gestiona la información de tus pacientes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-beute-gold text-white rounded-xl 
                          hover:bg-beute-gold-dark transition-colors">
          <Plus className="w-4 h-4" />
          <span className="font-medium">Nuevo Paciente</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beute-taupe" />
          <input
            type="text"
            placeholder="Buscar paciente por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-beute-taupe/20 
                      focus:border-beute-gold focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-beute-taupe/20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-beute-taupe/20 rounded" />
                  <div className="h-3 w-24 bg-beute-taupe/20 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-beute-taupe/20 rounded" />
                <div className="h-3 w-3/4 bg-beute-taupe/20 rounded" />
              </div>
            </div>
          ))
        ) : patients?.map((patient) => (
          <div 
            key={patient.id}
            onClick={() => setSelectedPatient(patient.id)}
            className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-elegant transition-shadow cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-beute-gold/20 to-beute-gold/5 
                                flex items-center justify-center">
                  <span className="font-dream text-2xl text-beute-gold">
                    {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-dream text-lg text-beute-earth-dark">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-beute-taupe">
                    Paciente desde {new Date(patient.createdAt).toLocaleDateString('es-ES', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-beute-taupe group-hover:text-beute-gold 
                                       group-hover:translate-x-1 transition-all" />
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-beute-earth-medium">
                <Phone className="w-4 h-4 text-beute-gold" />
                {patient.phone}
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-sm text-beute-earth-medium">
                  <Mail className="w-4 h-4 text-beute-gold" />
                  <span className="truncate">{patient.email}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-4 border-t border-beute-taupe/10">
              <div className="text-center">
                <p className="font-dream text-xl text-beute-earth-dark">{patient.totalAppointments}</p>
                <p className="text-xs text-beute-taupe">Citas</p>
              </div>
              {patient.lastVisit && (
                <div>
                  <p className="font-dream text-xl text-beute-earth-dark">
                    {new Date(patient.lastVisit).toLocaleDateString('es-ES', { 
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                  <p className="text-xs text-beute-taupe">Última visita</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                                bg-beute-gold/10 text-beute-gold rounded-xl text-sm font-medium
                                hover:bg-beute-gold hover:text-white transition-colors">
                <Calendar className="w-4 h-4" />
                Agendar
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                                bg-beute-cream text-beute-earth-medium rounded-xl text-sm font-medium
                                hover:bg-beute-taupe/20 transition-colors">
                <FileText className="w-4 h-4" />
                Historial
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!patients || patients.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-beute-cream rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-beute-taupe" />
          </div>
          <h3 className="font-dream text-xl text-beute-earth-dark mb-2">No se encontraron pacientes</h3>
          <p className="text-beute-taupe mb-4">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  )
}
