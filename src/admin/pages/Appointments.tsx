import { useState, useMemo } from 'react';
import { 
  Search, CalendarDays, Clock,
  Plus, Download, MessageCircle,
  Instagram, Globe, Phone, ArrowUpDown, Trash2, Edit
} from 'lucide-react';
import { useDashboardData, useUpdateAppointmentStatus } from '../hooks/useDashboard';
import { format, parseISO } from 'date-fns';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmada', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completada', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700 border-red-200' },
  'no-show': { label: 'No asistió', color: 'bg-gray-100 text-gray-700 border-gray-200' },
};

const channelIcons = {
  web: Globe,
  whatsapp: MessageCircle,
  instagram: Instagram,
  phone: Phone,
};

const channelColors = {
  web: 'text-blue-600 bg-blue-50',
  whatsapp: 'text-green-600 bg-green-50',
  instagram: 'text-pink-600 bg-pink-50',
  phone: 'text-amber-600 bg-amber-50',
};

export function AppointmentsPage() {
  const { data, isLoading } = useDashboardData();
  const updateStatus = useUpdateAppointmentStatus();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const appointments = data?.appointments || [];
  
  // Filter and sort appointments
  const filteredAppointments = useMemo(() => {
    let result = appointments.filter(apt => {
      const matchesSearch = 
        apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
        apt.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        apt.patientPhone.includes(search);
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      const matchesChannel = channelFilter === 'all' || apt.channel === channelFilter;
      const matchesDate = !dateFilter || apt.date === dateFilter;
      return matchesSearch && matchesStatus && matchesChannel && matchesDate;
    });
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      } else {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      }
    });
    
    return result;
  }, [appointments, search, statusFilter, channelFilter, dateFilter, sortBy, sortOrder]);
  
  // Calculate totals
  const totals = useMemo(() => {
    const completed = filteredAppointments.filter(a => a.status === 'completed');
    return {
      count: filteredAppointments.length,
      revenue: completed.reduce((sum, a) => sum + a.price, 0),
    };
  }, [filteredAppointments]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64 text-beute-taupe">
          Cargando citas...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-beute-earth-deep">Gestión de Citas</h1>
          <p className="text-sm text-beute-taupe">Administra todas las citas de tu clínica</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nueva Cita</span>
          </button>
          <button className="p-2 text-beute-taupe hover:text-beute-earth-deep hover:bg-beute-cream rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = appointments.filter(a => a.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
              className={`p-4 rounded-xl border transition-all text-left ${
                statusFilter === key 
                  ? 'border-amber-300 bg-amber-50' 
                  : 'border-beute-taupe/10 bg-white hover:border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${config.color.split(' ')[0].replace('bg-', 'bg-').replace('100', '500')}`} />
                <span className="text-xs text-beute-taupe">{config.label}</span>
              </div>
              <p className="text-2xl font-bold text-beute-earth-deep">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-beute-taupe/10 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beute-taupe" />
            <input
              type="text"
              placeholder="Buscar por paciente, servicio o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-beute-taupe/20 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
            />
          </div>
          
          {/* Channel Filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-beute-taupe/20 focus:border-amber-500 focus:outline-none bg-white"
          >
            <option value="all">Todos los canales</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="web">Web</option>
            <option value="phone">Teléfono</option>
          </select>
          
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-beute-taupe" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-beute-taupe/20 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Active Filters & Sort */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-beute-taupe/10">
          {(statusFilter !== 'all' || channelFilter !== 'all' || dateFilter) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setChannelFilter('all');
                setDateFilter('');
              }}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
            >
              Limpiar filtros
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={() => {
              setSortBy('date');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
              sortBy === 'date' ? 'bg-amber-100 text-amber-700' : 'text-beute-taupe hover:bg-beute-cream'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Fecha
          </button>
          <button
            onClick={() => {
              setSortBy('price');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
              sortBy === 'price' ? 'bg-amber-100 text-amber-700' : 'text-beute-taupe hover:bg-beute-cream'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Precio
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-beute-taupe">
          Mostrando <span className="font-medium text-beute-earth-deep">{filteredAppointments.length}</span> citas
          {totals.revenue > 0 && (
            <span className="ml-2">
              • Ingresos: <span className="font-medium text-emerald-600">₡{totals.revenue.toLocaleString()}</span>
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-beute-taupe/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-beute-cream/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-beute-taupe uppercase">Paciente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-beute-taupe uppercase">Servicio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-beute-taupe uppercase">Fecha/Hora</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-beute-taupe uppercase">Canal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-beute-taupe uppercase">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-beute-taupe uppercase">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-beute-taupe uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beute-taupe/10">
              {filteredAppointments.map((appointment) => {
                const status = statusConfig[appointment.status as keyof typeof statusConfig];
                const ChannelIcon = channelIcons[appointment.channel as keyof typeof channelIcons] || Globe;
                
                return (
                  <tr key={appointment.id} className="hover:bg-beute-cream/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-amber-600">
                            {appointment.patientName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-beute-earth-deep text-sm">{appointment.patientName}</p>
                          <p className="text-xs text-beute-taupe">{appointment.patientPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-beute-earth-deep text-sm">{appointment.serviceName}</p>
                      <p className="text-xs text-beute-taupe">{appointment.duration} min</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-amber-600" />
                        <span className="text-beute-earth-deep">
                          {format(parseISO(appointment.date), 'dd/MM/yyyy')}
                        </span>
                        <Clock className="w-4 h-4 text-beute-taupe ml-1" />
                        <span className="text-beute-taupe">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${channelColors[appointment.channel]}`}>
                        <ChannelIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium capitalize">{appointment.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-beute-earth-deep">₡{appointment.price.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateStatus.mutate({ id: appointment.id, status: e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show' })}
                        className={`px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer ${status.color}`}
                      >
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 text-beute-taupe hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-beute-taupe hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredAppointments.length === 0 && (
          <div className="p-12 text-center">
            <CalendarDays className="w-12 h-12 text-beute-taupe/30 mx-auto mb-3" />
            <p className="text-beute-taupe">No se encontraron citas</p>
            <p className="text-sm text-beute-taupe/60">Intenta con otros filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}
