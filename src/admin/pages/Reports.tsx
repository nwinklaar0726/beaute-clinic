import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  DollarSign,
  Users,
  Clock
} from 'lucide-react'
import { useRevenueReport, useServicesReport } from '../hooks/useAdminData'

export function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  const { data: _revenueData } = useRevenueReport(dateRange)
  const { data: _servicesData } = useServicesReport(dateRange)

  // Mock data for charts (until API is ready)
  const mockRevenueData = [
    { day: 'Lun', amount: 150000 },
    { day: 'Mar', amount: 230000 },
    { day: 'Mié', amount: 180000 },
    { day: 'Jue', amount: 320000 },
    { day: 'Vie', amount: 280000 },
    { day: 'Sáb', amount: 420000 },
    { day: 'Dom', amount: 120000 },
  ]

  const mockServicesData = [
    { name: 'Aparatología', count: 45, revenue: 2250000 },
    { name: 'Medicina Estética', count: 32, revenue: 4800000 },
    { name: 'Nutrición', count: 28, revenue: 1400000 },
    { name: 'Beauty Bar', count: 56, revenue: 1960000 },
    { name: 'Wellness', count: 18, revenue: 1350000 },
  ]

  const maxRevenue = Math.max(...mockRevenueData.map(d => d.amount))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-dream text-2xl text-beute-earth-deep">Reportes</h1>
          <p className="text-sm text-beute-taupe">Análisis de rendimiento y métricas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-beute-gold/10 text-beute-gold rounded-xl 
                          hover:bg-beute-gold hover:text-white transition-colors">
          <Download className="w-4 h-4" />
          <span className="font-medium">Exportar</span>
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-beute-taupe" />
            <span className="text-sm text-beute-earth-medium">Período:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-beute-taupe/20 focus:border-beute-gold 
                        focus:outline-none text-sm"
            />
            <span className="text-beute-taupe">hasta</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-beute-taupe/20 focus:border-beute-gold 
                        focus:outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            {['7 días', '30 días', '3 meses', '1 año'].map((period) => (
              <button
                key={period}
                className="px-3 py-1.5 text-sm rounded-lg bg-beute-cream text-beute-earth-medium 
                          hover:bg-beute-gold hover:text-white transition-colors"
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-beute-gold/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-beute-gold" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-sm text-beute-taupe">Ingresos Totales</p>
          <p className="font-dream text-2xl text-beute-earth-deep">₡11,760,000</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-beute-rose/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-beute-rose" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <p className="text-sm text-beute-taupe">Total Pacientes</p>
          <p className="font-dream text-2xl text-beute-earth-dark">179</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-beute-olive/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-beute-olive" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              +5%
            </span>
          </div>
          <p className="text-sm text-beute-taupe">Citas Completadas</p>
          <p className="font-dream text-2xl text-beute-earth-dark">156</p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            <span className="flex items-center gap-1 text-red-500 text-sm">
              <TrendingDown className="w-4 h-4" />
              -2%
            </span>
          </div>
          <p className="text-sm text-beute-taupe">Ticket Promedio</p>
          <p className="font-dream text-2xl text-beute-earth-deep">₡75,385</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-dream text-lg text-beute-earth-deep mb-6">Ingresos Diarios</h2>
          <div className="h-64 flex items-end gap-2">
            {mockRevenueData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-beute-gold to-beute-gold-light rounded-t-lg 
                            transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(day.amount / maxRevenue) * 100}%` }}
                />
                <span className="text-xs text-beute-taupe">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services Performance */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-dream text-lg text-beute-earth-deep mb-6">Rendimiento por Servicio</h2>
          <div className="space-y-4">
            {mockServicesData.map((service) => (
              <div key={service.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-beute-earth-dark">{service.name}</span>
                  <span className="text-sm font-medium text-beute-earth-dark">
                    ₡{service.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-beute-cream rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-beute-gold to-beute-gold-light rounded-full"
                      style={{ width: `${(service.revenue / 5000000) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-beute-taupe w-12 text-right">{service.count} citas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
