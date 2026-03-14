import { useState, useMemo } from 'react';
import { 
  CalendarDays, Users, DollarSign, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, MessageCircle,
  Instagram, Phone, Globe, RefreshCw,
  ChevronRight, Sparkles
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useDashboardData, useUpdateAppointmentStatus } from '../hooks/useDashboard';
import { StatCard } from '../components/StatCard';
import { SocialBookingPanel } from '../components/SocialBookingPanel';
import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  confirmed: { label: 'Confirmada', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  completed: { label: 'Completada', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  'no-show': { label: 'No asistió', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: AlertCircle },
};

const channelIcons = {
  web: Globe,
  whatsapp: MessageCircle,
  instagram: Instagram,
  phone: Phone,
};

export function DashboardPage() {
  const { data, isLoading, refetch } = useDashboardData();
  const updateStatus = useUpdateAppointmentStatus();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  
  const { appointments, stats } = data || { appointments: [], stats: null };
  
  // Filter appointments by period
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const date = parseISO(apt.date);
      if (selectedPeriod === 'today') return isToday(date);
      if (selectedPeriod === 'week') return isThisWeek(date);
      if (selectedPeriod === 'month') return isThisMonth(date);
      return true;
    }).slice(0, 10);
  }, [appointments, selectedPeriod]);
  
  // Calculate trends
  const trends = useMemo(() => {
    if (!stats) return null;
    return {
      revenue: { value: 12, positive: true },
      appointments: { value: 8, positive: true },
      patients: { value: 15, positive: true },
      cancellation: { value: -2, positive: true },
    };
  }, [stats]);

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({ id, status: status as any });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-amber-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="text-lg">Cargando dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-beute-earth-deep">Dashboard</h1>
          <p className="text-sm text-beute-taupe">
            {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="p-2 text-beute-taupe hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link 
            to="/admin/appointments"
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Ver Citas</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ingresos Hoy"
          value={`₡${stats.revenueToday.toLocaleString()}`}
          subtitle={`₡${stats.revenueWeek.toLocaleString()} esta semana`}
          trend={trends?.revenue}
          icon={DollarSign}
          color="gold"
        />
        <StatCard
          title="Citas Hoy"
          value={stats.appointmentsToday}
          subtitle={`${stats.appointmentsWeek} esta semana`}
          trend={trends?.appointments}
          icon={CalendarDays}
          color="blue"
        />
        <StatCard
          title="Pacientes"
          value={stats.totalPatients}
          subtitle={`${stats.newPatientsMonth} nuevos este mes`}
          trend={trends?.patients}
          icon={Users}
          color="rose"
        />
        <StatCard
          title="Ticket Promedio"
          value={`₡${stats.averageTicket.toLocaleString()}`}
          subtitle={`Proyección: ₡${stats.projectedRevenue.toLocaleString()}`}
          trend={{ value: 5, positive: true }}
          icon={TrendingUp}
          color="olive"
        />
      </div>

      {/* KPIs Secondary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-beute-taupe/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-beute-earth-deep">{stats.completedAppointments}</p>
              <p className="text-xs text-beute-taupe">Completadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-beute-taupe/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-beute-earth-deep">{stats.pendingAppointments}</p>
              <p className="text-xs text-beute-taupe">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-beute-taupe/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-beute-earth-deep">{stats.cancellationRate}%</p>
              <p className="text-xs text-beute-taupe">Cancelación</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-beute-taupe/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-beute-earth-deep">{stats.conversionRate}%</p>
              <p className="text-xs text-beute-taupe">Conversión</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointments Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-beute-taupe/10">
            <div className="p-5 border-b border-beute-taupe/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold text-beute-earth-deep">Citas Recientes</h2>
              </div>
              <div className="flex items-center gap-2">
                {(['today', 'week', 'month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedPeriod === period
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-beute-taupe hover:bg-beute-cream'
                    }`}
                  >
                    {period === 'today' ? 'Hoy' : period === 'week' ? 'Semana' : 'Mes'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="divide-y divide-beute-taupe/10">
              {filteredAppointments.length === 0 ? (
                <div className="p-8 text-center text-beute-taupe">
                  No hay citas para este período
                </div>
              ) : (
                filteredAppointments.map((appointment) => {
                  const status = statusConfig[appointment.status];
                  const StatusIcon = status.icon;
                  const ChannelIcon = channelIcons[appointment.channel];
                  
                  return (
                    <div key={appointment.id} className="p-4 hover:bg-beute-cream/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg ${status.color.split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                            <StatusIcon className={`w-5 h-5 ${status.color.split(' ')[1]}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-beute-earth-deep">{appointment.patientName}</p>
                              <ChannelIcon className="w-3.5 h-3.5 text-beute-taupe" />
                            </div>
                            <p className="text-sm text-beute-taupe">{appointment.serviceName}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-beute-taupe">
                              <span>{format(parseISO(appointment.date), 'dd/MM/yyyy')}</span>
                              <span>{appointment.time}</span>
                              <span>₡{appointment.price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer ${status.color}`}
                          >
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <option key={key} value={key}>{config.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="p-4 border-t border-beute-taupe/10">
              <Link 
                to="/admin/appointments"
                className="flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
              >
                Ver todas las citas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Channel Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-beute-taupe/10 p-5">
            <h3 className="font-semibold text-beute-earth-deep mb-4">Canales de Reserva</h3>
            <div className="space-y-4">
              {[
                { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500', count: stats.channelStats.whatsapp },
                { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-500', count: stats.channelStats.instagram },
                { key: 'web', label: 'Web', icon: Globe, color: 'bg-blue-500', count: stats.channelStats.web },
                { key: 'phone', label: 'Teléfono', icon: Phone, color: 'bg-amber-500', count: stats.channelStats.phone },
              ].map((channel) => (
                <div key={channel.key} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${channel.color} bg-opacity-10 flex items-center justify-center`}>
                    <channel.icon className={`w-5 h-5 ${channel.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-beute-earth-deep">{channel.label}</span>
                      <span className="font-bold text-beute-earth-deep">{channel.count}</span>
                    </div>
                    <div className="h-2 bg-beute-cream rounded-full overflow-hidden mt-1">
                      <div 
                        className={`h-full ${channel.color} rounded-full`}
                        style={{ width: `${(channel.count / stats.totalAppointments) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Service */}
          {stats.mostPopularService && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-beute-earth-deep">Servicio Estrella</h3>
              </div>
              <p className="text-lg font-bold text-amber-700">{stats.mostPopularService.name}</p>
              <p className="text-sm text-beute-taupe">{stats.mostPopularService.count} reservas</p>
            </div>
          )}

          {/* Social Booking Panel */}
          <SocialBookingPanel />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-beute-taupe/10 p-5">
            <h3 className="font-semibold text-beute-earth-deep mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Link 
                to="/admin/appointments"
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-beute-earth-deep transition-colors"
              >
                <CalendarDays className="w-5 h-5 text-amber-600" />
                <span className="font-medium">Nueva Cita</span>
              </Link>
              <Link 
                to="/admin/patients"
                className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-beute-earth-deep transition-colors"
              >
                <Users className="w-5 h-5 text-rose-600" />
                <span className="font-medium">Nuevo Paciente</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
