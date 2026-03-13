import { useState } from 'react'
import { Zap, Syringe, Apple, Sparkles, X, ArrowRight, Check } from 'lucide-react'
import { SectionHeader, SectionContainer } from '@/components/ui/section-header'
import { CardLuxury, CardBadge, CardContent } from '@/components/ui/card-luxury'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ SERVICES SECTION
 * 
 * Sección de servicios diseñada según el Brandbook:
 * - Grid de categorías principales
 * - Tarjetas con imágenes y overlays
 * - Modal de detalle de servicio
 * - Micro-interacciones suaves
 */

interface Service {
  id: string
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  image: string
  features: string[]
  treatments: string[]
  category: string
  duration: string
  price: string
  color: 'gold' | 'rose' | 'olive'
}

const services: Service[] = [
  {
    id: 'aparatologia',
    icon: Zap,
    title: 'Aparatología',
    subtitle: 'Avanzada',
    description: 'Tecnología de punta para tratamientos faciales y corporales no invasivos. Resultados visibles desde la primera sesión con equipos certificados.',
    image: '/images/aparatologia.jpg',
    features: ['Tecnología de última generación', 'Tratamientos no invasivos', 'Resultados duraderos', 'Sin tiempo de recuperación'],
    treatments: ['Láser facial rejuvenecedor', 'Radiofrecencia corporal', 'Criolipólisis', 'Ultrasonido focalizado', 'Terapia LED'],
    category: 'Medicina Estética',
    duration: '45-60 min',
    price: '₡80,000',
    color: 'gold'
  },
  {
    id: 'medicina-estetica',
    icon: Syringe,
    title: 'Medicina',
    subtitle: 'Estética',
    description: 'Procedimientos médicos estéticos realizados por la Dra. Meyryn Carrillo con técnicas avanzadas para realzar tu belleza natural.',
    image: '/images/medicina-estetica.jpg',
    features: ['Médico especialista certificado', 'Productos de alta calidad', 'Técnicas minimamente invasivas', 'Resultados naturales'],
    treatments: ['Ácido hialurónico', 'Toxina botulínica', 'Rinomodelación', 'Bioestimulación', 'Mesoterapia'],
    category: 'Medicina Estética',
    duration: '30-45 min',
    price: '₡120,000',
    color: 'rose'
  },
  {
    id: 'nutricion',
    icon: Apple,
    title: 'Nutrición',
    subtitle: 'Oncológica',
    description: 'Programas de nutrición especializados para pacientes oncológicos y personas que buscan mejorar su salud integral.',
    image: '/images/nutricion.jpg',
    features: ['Planes personalizados', 'Seguimiento continuo', 'Enfoque integral', 'Especialidad oncológica'],
    treatments: ['Consulta nutricional', 'Plan alimenticio personalizado', 'Nutrición oncológica', 'Control de peso', 'Suplementación'],
    category: 'Nutrición',
    duration: '60 min',
    price: '₡50,000',
    color: 'olive'
  }
]

interface ServicesProps {
  onBookService?: (serviceId: string) => void
}

export function Services({ onBookService }: ServicesProps = {}) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const handleBook = (serviceId: string) => {
    setSelectedService(null)
    if (onBookService) {
      onBookService(serviceId)
    } else {
      document.querySelector('#agendar')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <SectionContainer 
      id="servicios" 
      className="bg-beute-cream"
      withPattern
    >
      {/* Section Header */}
      <div className="flex justify-center">
        <SectionHeader
          label="Nuestros Servicios"
          labelIcon={<Sparkles className="w-4 h-4" />}
          title="Servicios Médicos de"
          titleHighlight="Excelencia"
          subtitle="Ofrecemos una gama completa de tratamientos estéticos y de bienestar, diseñados para realzar tu belleza natural con los más altos estándares de calidad."
          align="center"
        />
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <CardLuxury
            key={service.id}
            variant="glass"
            padding="none"
            className="group cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedService(service)}
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-beute-earth-deep/80 via-beute-earth-deep/30 to-transparent" />
              
              {/* Icon */}
              <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-lato font-semibold uppercase tracking-wider text-beute-gold-pale">
                  {service.category}
                </span>
                <h3 className="font-dream text-2xl text-white mt-1">
                  {service.title}
                </h3>
                <p className="text-sm text-beute-gold font-medium">{service.subtitle}</p>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-6">
              <p className="text-beute-earth-medium font-light leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>
              
              <div className="space-y-2 mb-4">
                {service.features.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-beute-gold flex-shrink-0" />
                    <span className="text-sm text-beute-earth-dark">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-beute-taupe-light/30">
                <div className="text-sm text-beute-earth-medium">
                  <span className="text-beute-taupe">Desde </span>
                  <span className="font-semibold text-beute-earth-deep">{service.price}</span>
                </div>
                <span className="text-beute-gold text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Ver más <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </CardContent>
          </CardLuxury>
        ))}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-beute-earth-deep/60 backdrop-blur-sm" 
            onClick={() => setSelectedService(null)} 
          />
          
          {/* Modal */}
          <CardLuxury 
            variant="glass" 
            padding="none"
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in"
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedService(null)} 
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm 
                         flex items-center justify-center hover:bg-white transition-colors shadow-soft"
            >
              <X className="w-5 h-5 text-beute-earth-deep" />
            </button>
            
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 md:h-auto">
                <img 
                  src={selectedService.image} 
                  alt={selectedService.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-beute-earth-deep/60 to-transparent md:bg-gradient-to-r" />
                
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <CardBadge variant={selectedService.color}>
                    {selectedService.category}
                  </CardBadge>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-beute-gold/10 flex items-center justify-center">
                    <selectedService.icon className="w-6 h-6 text-beute-gold" />
                  </div>
                  <div>
                    <h3 className="font-dream text-2xl text-beute-earth-deep">
                      {selectedService.title}
                    </h3>
                    <p className="text-beute-gold font-medium">{selectedService.subtitle}</p>
                  </div>
                </div>

                <p className="text-beute-earth-medium font-light leading-relaxed mb-6">
                  {selectedService.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-dream text-lg text-beute-earth-deep mb-3">
                    Características
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedService.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-beute-gold flex-shrink-0" />
                        <span className="text-sm text-beute-earth-dark">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treatments */}
                <div className="mb-6">
                  <h4 className="font-dream text-lg text-beute-earth-deep mb-3">
                    Tratamientos Disponibles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.treatments.map((treatment, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1.5 rounded-full text-xs font-medium
                                   bg-beute-gold/10 text-beute-gold border border-beute-gold/30"
                      >
                        {treatment}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-6 mb-6 py-4 border-y border-beute-taupe-light/30">
                  <div>
                    <span className="text-xs text-beute-taupe uppercase tracking-wider block">Duración</span>
                    <span className="font-medium text-beute-earth-deep">{selectedService.duration}</span>
                  </div>
                  <div className="w-px h-10 bg-beute-taupe-light" />
                  <div>
                    <span className="text-xs text-beute-taupe uppercase tracking-wider block">Precio desde</span>
                    <span className="font-medium text-beute-earth-deep">{selectedService.price}</span>
                  </div>
                </div>

                {/* CTA */}
                <ButtonLuxury 
                  variant="primary" 
                  className="w-full"
                  onClick={() => handleBook(selectedService.id)}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Agendar este servicio
                </ButtonLuxury>
              </CardContent>
            </div>
          </CardLuxury>
        </div>
      )}
    </SectionContainer>
  )
}
