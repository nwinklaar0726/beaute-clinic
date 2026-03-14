import { 
  CalendarDays, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { useDashboardStats, useAppointments } from '../hooks/useAdminData'
import { Link } from '@tanstack/react-router'

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: recentAppointments } = useAppointments({ 
    dateRange: { 
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  })

  const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; bg: string }> = {
    confirmed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
    completed: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
    'no-show': { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50' },
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Citas Hoy"
          value={stats?.appointmentsToday || 0}
          subtitle={`${stats?.appointmentsWeek || 0} esta semana`}
          trend={{ value: 12, label: 'vs semana pasada', positive: true }}
          icon={CalendarDays}
          iconColor="gold"
          loading={statsLoading}
        />
        <StatCard
          title="Pacientes Totales"
          value={stats?.totalPatients || 0}
          subtitle={`${stats?.newPatientsMonth || 0} nuevos este mes`}
          trend={{ value: 8, label: 'vs mes pasado', positive: true }}
          icon={Users}
          iconColor="rose"
          loading={statsLoading}
        />
        <StatCard
          title="Ingresos del Mes"
          value={`₡${(stats?.revenueMonth || 0).toLocaleString()}`}
          subtitle={`₡${(stats?.totalRevenue || 0).toLocaleString()} total`}
          trend={{ value: 15, label: 'vs mes pasado', positive: true }}
          icon={DollarSign}
          iconColor="olive"
          loading={statsLoading}
        />
        <StatCard
          title="Satisfacción"
          value={`${stats?.averageRating || 0}/5`}
          subtitle={`${stats?.cancellationRate || 0}% cancelaciones`}
          trend={{ value: 5, label: 'vs mes pasado', positive: true }}
          icon={TrendingUp}
          iconColor="blue"
          loading={statsLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft">
          <div className="p-6 border-b border-beute-taupe/10 flex items-center justify-between">
            <div>
              <h2 className="font-dream text-xl text-beute-earth-deep">Próximas Citas</h2>
              <p className="text-sm text-beute-taupe">Citas programadas para hoy y mañana</p>
            </div>
            <Link 
              to="/admin/appointments"
              className="text-sm text-beute-gold hover:underline"
            >
              Ver todas
            </Link>
          </div>
          
          <div className="divide-y divide-beute-taupe/10">
            {recentAppointments?.slice(0, 5).map((appointment) => {
              const status = statusConfig[appointment.status] || statusConfig.pending
              const StatusIcon = status.icon
              
              return (
                <div key={appointment.id} className="p-4 hover:bg-beute-cream/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${status.bg} flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${status.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-beute-earth-dark">{appointment.patientName}</p>
                        <p className="text-sm text-beute-taupe">{appointment.serviceName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-beute-earth-dark">{appointment.time}</p>
                      <p className="text-xs text-beute-taupe">
                        {new Date(appointment.date).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {(!recentAppointments || recentAppointments.length === 0) && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-beute-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-beute-taupe" />
                </div>
                <p className="text-beute-taupe">No hay citas programadas</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h2 className="font-dream text-lg text-beute-earth-deep mb-4">Acciones Rápidas</h2>
            <div className="space-y-3">
              <Link 
                to="/admin/appointments"
                className="flex items-center gap-3 p-3 rounded-xl bg-beute-gold/5 hover:bg-beute-gold/10 
                         text-beute-earth-dark transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-beute-gold/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-beute-gold" />
                </div>
                <span className="font-medium">Agendar Nueva Cita</span>
              </Link>
              
              <Link 
                to="/admin/patients"
                className="flex items-center gap-3 p-3 rounded-xl bg-beute-rose/5 hover:bg-beute-rose/10 
                         text-beute-earth-dark transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-beute-rose/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-beute-rose" />
                </div>
                <span className="font-medium">Registrar Paciente</span>
              </Link>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-gradient-to-br from-beute-gold/10 to-beute-gold/5 rounded-2xl p-6 border border-beute-gold/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-beute-gold flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-beute-earth-dark mb-1">Recordatorios</h3>
                <ul className="space-y-2 text-sm text-beute-earth-medium">
                  <li>• 3 citas sin confirmar para mañana</li>
                  <li>• 2 pacientes con seguimiento pendiente</li>
                  <li>• Inventario de productos bajo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
