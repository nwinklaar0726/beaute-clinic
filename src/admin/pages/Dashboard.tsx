import { useEffect, useState } from 'react'
import { 
  CalendarDays, 
  Users, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Star,
  ArrowUpRight
} from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { Link } from '@tanstack/react-router'

// Mock data - replace with actual API calls
const mockStats = {
  appointmentsToday: 8,
  appointmentsWeek: 32,
  totalPatients: 487,
  newPatientsMonth: 24,
  revenueMonth: 2850000,
  totalRevenue: 15600000,
  averageRating: 4.9,
  cancellationRate: 3,
}

const mockRecentAppointments = [
  { id: 1, patientName: 'María González', service: 'Facial Hidratante', time: '10:00', date: 'Hoy', status: 'confirmed' },
  { id: 2, patientName: 'Ana Rodríguez', service: 'Nutrición Clínica', time: '11:30', date: 'Hoy', status: 'pending' },
  { id: 3, patientName: 'Carmen Silva', service: 'Mesoterapia', time: '14:00', date: 'Hoy', status: 'confirmed' },
  { id: 4, patientName: 'Laura Martínez', service: 'Radiofrecuencia', time: '16:00', date: 'Mañana', status: 'confirmed' },
  { id: 5, patientName: 'Patricia López', service: 'Consulta General', time: '09:00', date: 'Mañana', status: 'pending' },
]

const mockTopServices = [
  { name: 'Facial Hidratante', count: 45, revenue: 1350000 },
  { name: 'Mesoterapia', count: 38, revenue: 1900000 },
  { name: 'Radiofrecuencia', count: 32, revenue: 1600000 },
  { name: 'Nutrición Clínica', count: 28, revenue: 840000 },
]

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string; label: string }> = {
  confirmed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Confirmada' },
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Pendiente' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelada' },
  completed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Completada' },
}

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Resumen de tu clínica hoy</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Citas Hoy"
          value={mockStats.appointmentsToday}
          subtitle={`${mockStats.appointmentsWeek} esta semana`}
          trend={{ value: 12, label: 'vs semana pasada', positive: true }}
          icon={CalendarDays}
          iconColor="gold"
          loading={isLoading}
        />
        <StatCard
          title="Pacientes"
          value={mockStats.totalPatients}
          subtitle={`${mockStats.newPatientsMonth} nuevos este mes`}
          trend={{ value: 8, label: 'vs mes pasado', positive: true }}
          icon={Users}
          iconColor="rose"
          loading={isLoading}
        />
        <StatCard
          title="Ingresos Mes"
          value={`₡${(mockStats.revenueMonth / 1000000).toFixed(1)}M`}
          subtitle={`₡${(mockStats.totalRevenue / 1000000).toFixed(1)}M total`}
          trend={{ value: 15, label: 'vs mes pasado', positive: true }}
          icon={DollarSign}
          iconColor="olive"
          loading={isLoading}
        />
        <StatCard
          title="Satisfacción"
          value={`${mockStats.averageRating}/5`}
          subtitle={`${mockStats.cancellationRate}% cancelaciones`}
          trend={{ value: 5, label: 'vs mes pasado', positive: true }}
          icon={Star}
          iconColor="purple"
          loading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-gray-900">Citas Recientes</h2>
            </div>
            <Link 
              to="/admin/appointments"
              className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Ver todas
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {mockRecentAppointments.map((appointment) => {
              const status = statusConfig[appointment.status] || statusConfig.pending
              const StatusIcon = status.icon
              
              return (
                <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">{appointment.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                      <p className="text-xs text-gray-500">{appointment.date}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" />
              Acciones Rápidas
            </h2>
            <div className="space-y-2">
              <Link 
                to="/admin/appointments"
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 
                         text-gray-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-amber-600" />
                </div>
                <span className="font-medium">Nueva Cita</span>
              </Link>
              
              <Link 
                to="/admin/patients"
                className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 
                         text-gray-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-rose-600" />
                </div>
                <span className="font-medium">Nuevo Paciente</span>
              </Link>
              
              <Link 
                to="/admin/services"
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 
                         text-gray-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-medium">Gestionar Servicios</span>
              </Link>
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Servicios Populares</h2>
            <div className="space-y-4">
              {mockTopServices.map((service) => (
                <div key={service.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    <span className="text-sm text-gray-500">{service.count} citas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                        style={{ width: `${(service.count / 50) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-16 text-right">
                      ₡{(service.revenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Recordatorios</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    3 citas sin confirmar
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    2 pacientes con seguimiento
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    Inventario bajo en productos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
