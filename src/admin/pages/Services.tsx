import { useState } from 'react'
import { 
  Clock, 
  DollarSign, 
  Edit2, 
  Eye, 
  EyeOff,
  Plus
} from 'lucide-react'
import { useServices, useUpdateService } from '../hooks/useAdminData'
import type { Service } from '../types'

const categoryLabels: Record<string, string> = {
  'aparatologia': 'Aparatología',
  'medicina-estetica': 'Medicina Estética',
  'nutricion': 'Nutrición',
  'beauty-bar': 'Beauty Bar',
  'wellness': 'Wellness',
}

const categoryColors: Record<string, string> = {
  'aparatologia': 'bg-purple-50 text-purple-700',
  'medicina-estetica': 'bg-rose-50 text-rose-700',
  'nutricion': 'bg-green-50 text-green-700',
  'beauty-bar': 'bg-amber-50 text-amber-700',
  'wellness': 'bg-blue-50 text-blue-700',
}

export function ServicesPage() {
  const [_editingService, setEditingService] = useState<Service | null>(null)
  const { data: services, isLoading } = useServices()
  const updateMutation = useUpdateService()

  const toggleServiceStatus = (service: Service) => {
    updateMutation.mutate({
      id: service.id,
      data: { isActive: !service.isActive }
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-dream text-2xl text-beute-earth-deep">Servicios</h1>
          <p className="text-sm text-beute-taupe">Administra los servicios ofrecidos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-beute-gold text-white rounded-xl 
                          hover:bg-beute-gold-dark transition-colors">
          <Plus className="w-4 h-4" />
          <span className="font-medium">Nuevo Servicio</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft p-6 animate-pulse">
              <div className="h-4 w-24 bg-beute-taupe/20 rounded mb-3" />
              <div className="h-6 w-48 bg-beute-taupe/20 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-beute-taupe/20 rounded" />
                <div className="h-3 w-3/4 bg-beute-taupe/20 rounded" />
              </div>
            </div>
          ))
        ) : services?.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-elegant transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                  categoryColors[service.category] || 'bg-beute-cream text-beute-earth-medium'
                }`}>
                  {categoryLabels[service.category] || service.category}
                </span>
                <h3 className="font-dream text-xl text-beute-earth-dark">{service.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toggleServiceStatus(service)}
                  className={`p-2 rounded-lg transition-colors ${
                    service.isActive 
                      ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                  title={service.isActive ? 'Activo' : 'Inactivo'}
                >
                  {service.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setEditingService(service)}
                  className="p-2 hover:bg-beute-cream rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-beute-taupe" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-beute-earth-medium mb-4 line-clamp-2">
              {service.description}
            </p>

            {/* Details */}
            <div className="flex items-center gap-4 pt-4 border-t border-beute-taupe/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-beute-gold" />
                <span className="text-sm text-beute-earth-dark">{service.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-beute-gold" />
                <span className="text-sm text-beute-earth-dark">₡{service.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-4">
              {service.popular && (
                <span className="px-2 py-1 bg-beute-gold/10 text-beute-gold text-xs rounded-full">
                  Popular
                </span>
              )}
              {service.requiresConsultation && (
                <span className="px-2 py-1 bg-beute-rose/10 text-beute-rose text-xs rounded-full">
                  Requiere consulta
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
