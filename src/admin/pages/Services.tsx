import { useState } from 'react'
import { 
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  MoreHorizontal,
  Search,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react'

// Mock services data
const mockServices = [
  {
    id: 1,
    name: 'Facial Hidratante Profundo',
    description: 'Tratamiento facial completo con hidratación intensiva para todo tipo de piel',
    duration: 60,
    price: 45000,
    category: 'Faciales',
    isActive: true,
    popular: true,
    requiresConsultation: false,
    totalBookings: 156,
    revenue: 7020000,
    image: '/images/aparatologia.jpg'
  },
  {
    id: 2,
    name: 'Mesoterapia Facial',
    description: 'Tratamiento con vitaminas y minerales para rejuvenecimiento facial',
    duration: 90,
    price: 85000,
    category: 'Medicina Estética',
    isActive: true,
    popular: true,
    requiresConsultation: true,
    totalBookings: 89,
    revenue: 7565000,
    image: '/images/medicina-estetica.jpg'
  },
  {
    id: 3,
    name: 'Radiofrecuencia',
    description: 'Tratamiento reafirmante con tecnología de última generación',
    duration: 60,
    price: 65000,
    category: 'Aparatología',
    isActive: true,
    popular: false,
    requiresConsultation: false,
    totalBookings: 72,
    revenue: 4680000,
    image: '/images/aparatologia.jpg'
  },
  {
    id: 4,
    name: 'Consulta Nutricional',
    description: 'Evaluación completa y plan nutricional personalizado',
    duration: 45,
    price: 35000,
    category: 'Nutrición',
    isActive: true,
    popular: false,
    requiresConsultation: false,
    totalBookings: 124,
    revenue: 4340000,
    image: '/images/nutricion.jpg'
  },
  {
    id: 5,
    name: 'Dermapen',
    description: 'Microneedling para estimulación de colágeno',
    duration: 75,
    price: 75000,
    category: 'Medicina Estética',
    isActive: false,
    popular: false,
    requiresConsultation: true,
    totalBookings: 45,
    revenue: 3375000,
    image: '/images/medicina-estetica.jpg'
  },
  {
    id: 6,
    name: 'Manicure Spa',
    description: 'Cuidado completo de manos con productos premium',
    duration: 45,
    price: 18000,
    category: 'Beauty Bar',
    isActive: true,
    popular: false,
    requiresConsultation: false,
    totalBookings: 203,
    revenue: 3654000,
    image: '/images/manicure-pedicure.jpg'
  },
]

const categories = [
  'Todos',
  'Faciales',
  'Medicina Estética',
  'Aparatología',
  'Nutrición',
  'Beauty Bar',
]

const categoryColors: Record<string, string> = {
  'Faciales': 'bg-pink-100 text-pink-700',
  'Medicina Estética': 'bg-purple-100 text-purple-700',
  'Aparatología': 'bg-blue-100 text-blue-700',
  'Nutrición': 'bg-green-100 text-green-700',
  'Beauty Bar': 'bg-amber-100 text-amber-700',
}

export function ServicesPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todos')
  const [showInactive, setShowInactive] = useState(false)

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'Todos' || service.category === categoryFilter
    const matchesActive = showInactive || service.isActive
    return matchesSearch && matchesCategory && matchesActive
  })

  const activeServices = mockServices.filter(s => s.isActive).length
  const totalRevenue = mockServices.reduce((acc, s) => acc + s.revenue, 0)
  const totalBookings = mockServices.reduce((acc, s) => acc + s.totalBookings, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
          <p className="text-sm text-gray-500">Administra los servicios ofrecidos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl 
                          hover:bg-amber-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span className="font-medium">Nuevo Servicio</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
              <p className="text-xs text-gray-500">Servicios Activos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockServices.filter(s => s.popular).length}
              </p>
              <p className="text-xs text-gray-500">Populares</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              <p className="text-xs text-gray-500">Total Reservas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₡{(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Ingresos Totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 
                      focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                categoryFilter === category
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <label className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span className="text-sm text-gray-600">Mostrar inactivos</span>
        </label>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div 
            key={service.id}
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
              service.isActive ? 'border-gray-100' : 'border-gray-200 opacity-75'
            }`}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  categoryColors[service.category] || 'bg-gray-100 text-gray-700'
                }`}>
                  {service.category}
                </span>
                {service.popular && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    Popular
                  </span>
                )}
              </div>
              
              {/* Active Toggle */}
              <button 
                className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-colors ${
                  service.isActive 
                    ? 'bg-emerald-500/90 text-white' 
                    : 'bg-gray-500/90 text-white'
                }`}
              >
                {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Price Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-white">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xl font-bold">{service.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <Clock className="w-4 h-4" />
                  {service.duration} min
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 py-3 border-t border-b border-gray-100 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">{service.totalBookings}</span>
                  <span className="text-xs text-gray-400">reservas</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">
                    ₡{(service.revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {service.requiresConsultation && (
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg font-medium">
                    Requiere consulta previa
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
                                  bg-amber-600 text-white rounded-xl text-sm font-medium
                                  hover:bg-amber-700 transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium
                                  hover:bg-gray-200 transition-colors">
                  Ver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron servicios</h3>
          <p className="text-gray-500">Intenta con otros filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}
